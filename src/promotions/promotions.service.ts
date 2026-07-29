import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PromotionsService {
  constructor(private db: DatabaseService) {}

  async validateCoupon(code: string) {
    const coupon = await this.db.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) throw new BadRequestException('Cupón no existe');
    if (!coupon.isActive) throw new BadRequestException('El cupón no está activo');
    if (coupon.validUntil && coupon.validUntil < new Date()) {
      throw new BadRequestException('El cupón ha expirado');
    }
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      throw new BadRequestException('El cupón ya no es válido por límite de usos');
    }

    return coupon;
  }
}
