import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, CreateLineItemDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  private async generateInvoiceNumber(userId: string): Promise<string> {
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastInvoice) {
      return 'INV-1';
    }

    const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
    if (match && match[1]) {
      const nextNumber = parseInt(match[1], 10) + 1;
      return `INV-${nextNumber}`;
    }

    return `INV-${Date.now()}`;
  }

  private calculateTotals(
    lineItems: CreateLineItemDto[],
    discountStr: string | number = 0,
    taxRateStr: string | number = 0,
  ) {
    let subtotal = 0;
    const discount = Number(discountStr);
    const taxRate = Number(taxRateStr);

    const computedLineItems = lineItems.map((item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const amount = quantity * unitPrice;
      subtotal += amount;

      return {
        description: item.description,
        notes: item.notes,
        quantity,
        unitPrice,
        amount,
      };
    });

    const totalAfterDiscount = subtotal - discount;
    const taxAmount = totalAfterDiscount * (taxRate / 100);
    const total = totalAfterDiscount + taxAmount;

    return {
      subtotal,
      total,
      discount,
      taxRate,
      computedLineItems,
    };
  }

  async create(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const {
      clientId,
      issueDate,
      dueDate,
      projectName,
      notes,
      discount,
      taxRate,
      lineItems,
    } = createInvoiceDto;

    // Verify client
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!client) {
      throw new NotFoundException(
        'Client not found or does not belong to user',
      );
    }

    const invoiceNumber = await this.generateInvoiceNumber(userId);
    const {
      subtotal,
      total,
      discount: dsc,
      taxRate: tax,
      computedLineItems,
    } = this.calculateTotals(lineItems, discount, taxRate);

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        projectName,
        notes,
        subtotal,
        discount: dsc,
        taxRate: tax,
        total,
        balanceDue: total,
        amountPaid: 0,
        status: 'UNPAID',
        clientId,
        userId,
        lineItems: {
          create: computedLineItems,
        },
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

    return invoice;
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
    search: string,
    status?: string,
    clientId?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      userId,
      ...(status && { status: status as any }),
      ...(clientId && { clientId }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { projectName: { contains: search, mode: 'insensitive' } },
          { client: { clientName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              clientName: true,
              companyName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(userId: string, id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.findOne(userId, id);

    const dataToUpdate: Prisma.InvoiceUpdateInput = {};

    if (updateInvoiceDto.issueDate)
      dataToUpdate.issueDate = new Date(updateInvoiceDto.issueDate);
    if (updateInvoiceDto.dueDate)
      dataToUpdate.dueDate = new Date(updateInvoiceDto.dueDate);
    if (updateInvoiceDto.projectName !== undefined)
      dataToUpdate.projectName = updateInvoiceDto.projectName;
    if (updateInvoiceDto.notes !== undefined)
      dataToUpdate.notes = updateInvoiceDto.notes;

    // Determine if we need to recalculate totals
    const isUpdatingFinancials =
      updateInvoiceDto.lineItems !== undefined ||
      updateInvoiceDto.discount !== undefined ||
      updateInvoiceDto.taxRate !== undefined;

    if (isUpdatingFinancials) {
      // If line items are provided, use them. Else fetch existing ones to recalculate.
      let computedLineItems: any[] = [];
      let subtotal = 0;
      let total = 0;
      const discount =
        updateInvoiceDto.discount !== undefined
          ? Number(updateInvoiceDto.discount)
          : Number(invoice.discount);
      const taxRate =
        updateInvoiceDto.taxRate !== undefined
          ? Number(updateInvoiceDto.taxRate)
          : Number(invoice.taxRate);

      if (updateInvoiceDto.lineItems) {
        // Complete replacement
        const calc = this.calculateTotals(
          updateInvoiceDto.lineItems,
          discount,
          taxRate,
        );
        subtotal = calc.subtotal;
        total = calc.total;
        computedLineItems = calc.computedLineItems;

        // Delete old line items
        await this.prisma.lineItem.deleteMany({
          where: { invoiceId: invoice.id },
        });

        // Insert new ones
        dataToUpdate.lineItems = {
          create: computedLineItems,
        };
      } else {
        // Recalculate with existing line items but new discount/tax
        const calc = this.calculateTotals(
          invoice.lineItems.map((item) => ({
            description: item.description,
            notes: item.notes || '',
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
          discount,
          taxRate,
        );
        subtotal = calc.subtotal;
        total = calc.total;
      }

      dataToUpdate.subtotal = subtotal;
      dataToUpdate.discount = discount;
      dataToUpdate.taxRate = taxRate;
      dataToUpdate.total = total;
      // Balance due = total - amountPaid
      dataToUpdate.balanceDue = total - Number(invoice.amountPaid);

      // Auto update status if fully paid after recalculation
      const amountPaidNum = Number(invoice.amountPaid);
      if (Number(dataToUpdate.balanceDue) <= 0 && amountPaidNum > 0) {
        dataToUpdate.status = 'PAID';
      } else if (amountPaidNum > 0 && Number(dataToUpdate.balanceDue) > 0) {
        dataToUpdate.status = 'PARTIAL';
      } else {
        dataToUpdate.status = 'UNPAID';
      }
    }

    if (
      updateInvoiceDto.clientId &&
      updateInvoiceDto.clientId !== invoice.clientId
    ) {
      const client = await this.prisma.client.findFirst({
        where: { id: updateInvoiceDto.clientId, userId },
      });
      if (!client) throw new NotFoundException('Client not found');
      dataToUpdate.client = { connect: { id: updateInvoiceDto.clientId } };
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: dataToUpdate,
      include: {
        client: true,
        lineItems: true,
        payments: true,
      },
    });

    return updatedInvoice;
  }

  async remove(userId: string, id: string) {
    const invoice = await this.findOne(userId, id);

    await this.prisma.invoice.delete({
      where: { id: invoice.id },
    });

    return { message: 'Invoice deleted successfully' };
  }
}
