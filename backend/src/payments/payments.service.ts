import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    invoiceId: string,
    createPaymentDto: CreatePaymentDto,
  ) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const paymentAmount = Number(createPaymentDto.amount);
    const balanceDue = Number(invoice.balanceDue);

    if (paymentAmount > balanceDue) {
      throw new BadRequestException(
        `Payment amount (${paymentAmount}) exceeds the remaining balance (${balanceDue})`,
      );
    }

    if (paymentAmount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    return this.prisma.$transaction(async (tx) => {
   
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: paymentAmount,
          method: createPaymentDto.method,
          reference: createPaymentDto.reference,
          paidAt: new Date(createPaymentDto.paidAt),
          notes: createPaymentDto.notes,
        },
      });

    
      const newAmountPaid = Number(invoice.amountPaid) + paymentAmount;
      const newBalanceDue = Number(invoice.total) - newAmountPaid;

      let newStatus = invoice.status;
      if (newBalanceDue <= 0) {
        newStatus = InvoiceStatus.PAID;
      } else if (newAmountPaid > 0) {
        newStatus = InvoiceStatus.PARTIAL;
      }

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });
  }
}
