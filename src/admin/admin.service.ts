import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async getAllOrders() {
    return this.db.order.findMany({
      include: {
        payment: true,
        items: { include: { variant: { include: { product: true } } } },
        coupon: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(id: string, status: any) {
    const order = await this.db.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return this.db.order.update({ where: { id }, data: { status } });
  }

  async getAllCoupons() {
    return this.db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createCoupon(data: { code: string; discountPercentage: number; maxUses?: number; validUntil?: Date }) {
    return this.db.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase()
      }
    });
  }
}
