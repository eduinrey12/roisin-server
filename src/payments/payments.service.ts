import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  async createPayment(orderId: string, method: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY') {
    const order = await this.db.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Orden no encontrada');

    // If a payment already exists, return it or error
    const existing = await this.db.payment.findUnique({ where: { orderId } });
    if (existing) return existing;

    const payment = await this.db.payment.create({
      data: {
        orderId,
        method,
        amount: order.total,
        status: 'PENDING',
      }
    });

    // Update order status if needed
    if (method === 'BANK_TRANSFER') {
      await this.db.order.update({
        where: { id: orderId },
        data: { status: 'PAYMENT_PENDING' }
      });
    } else if (method === 'CASH_ON_DELIVERY') {
      // For cash on delivery, we might move straight to processing
      await this.db.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' }
      });
    }

    return payment;
  }

  async submitEvidence(orderId: string, evidenceUrl: string, referenceNumber?: string) {
    const payment = await this.db.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    if (payment.method !== 'BANK_TRANSFER') {
      throw new BadRequestException('El método de pago no requiere comprobante');
    }

    const updated = await this.db.payment.update({
      where: { id: payment.id },
      data: {
        evidenceUrl,
        referenceNumber,
        status: 'VERIFYING'
      }
    });

    await this.db.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' } // or keep PAYMENT_PENDING until verified by admin
    });

    return updated;
  }
}
