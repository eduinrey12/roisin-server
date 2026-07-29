import { Controller, Get, Param } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('api/v1/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('coupons/:code')
  async validateCoupon(@Param('code') code: string) {
    return this.promotionsService.validateCoupon(code);
  }
}
