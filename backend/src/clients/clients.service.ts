import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createClientDto: CreateClientDto) {
    const existingClient = await this.prisma.client.findFirst({
      where: {
        email: createClientDto.email,
        userId: userId,
      },
    });

    if (existingClient) {
      throw new ConflictException(
        'Client with same email already exists for this user',
      );
    }

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        userId,
      },
    });
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      OR: [
        { clientName: { contains: search, mode: 'insensitive' as const } },
        { companyName: { contains: search, mode: 'insensitive' as const } },
      ],
    };

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          invoices: {
            select: {
              status: true,
              balanceDue: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    const data = clients.map((client) => {
      const outstandingBalance = client.invoices
        .filter((inv) => inv.status !== 'PAID')
        .reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

      return {
        id: client.id,
        clientName: client.clientName,
        companyName: client.companyName,
        contactPerson: client.contactPerson,
        phoneNumber: client.phoneNumber,
        email: client.email,
        address: client.address,
        createdAt: client.createdAt,
        totalInvoices: client.invoices.length,
        outstandingBalance: outstandingBalance.toFixed(3),
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
      include: {
        invoices: {
          select: {
            status: true,
            balanceDue: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const outstandingBalance = client.invoices
      .filter((inv) => inv.status !== 'PAID')
      .reduce((sum, inv) => sum + Number(inv.balanceDue), 0);

    return {
      id: client.id,
      clientName: client.clientName,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
      totalInvoices: client.invoices.length,
      outstandingBalance: outstandingBalance.toFixed(3),
      createdAt: client.createdAt,
    };
  }

  async update(userId: string, id: string, updateClientDto: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.prisma.client.findFirst({
        where: {
          email: updateClientDto.email,
          userId: userId,
        },
      });

      if (existingClient) {
        throw new ConflictException(
          'Client with same email already exists for this user',
        );
      }
    }

    await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client._count.invoices > 0) {
      throw new BadRequestException('Client has existing invoices');
    }

    await this.prisma.client.delete({
      where: { id },
    });

    return { message: 'Client deleted successfully' };
  }
}
