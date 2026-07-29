import { Controller, Get, Post } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('api/v1/shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('regions')
  async getRegions() {
    return this.shippingService.getActiveRegions();
  }

  @Post('seed')
  async seed() {
    await this.shippingService.seedDemoRegions();
    return { status: 'seeded' };
  }
}
