import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId')
  async createPayment(
    @Param('orderId') orderId: string,
    @Body('method') method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY'
  ) {
    return this.paymentsService.createPayment(orderId, method);
  }

  @Post(':orderId/evidence')
  async submitEvidence(
    @Param('orderId') orderId: string,
    @Body() body: { evidenceUrl: string; referenceNumber?: string }
  ) {
    return this.paymentsService.submitEvidence(orderId, body.evidenceUrl, body.referenceNumber);
  }
}
