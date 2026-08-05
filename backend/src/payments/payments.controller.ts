import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAccessGuard)
@Controller('invoices/:invoiceId/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Param('invoiceId') invoiceId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(userId, invoiceId, createPaymentDto);
  }
}
