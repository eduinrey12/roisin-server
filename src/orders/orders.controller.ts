import { Controller, Post, Body, Headers, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Headers('x-guest-token') guestToken: string,
    @Body() checkoutData: any,
    @Request() req: any
  ) {
    // Note: If using JwtAuthGuard optionally, req.user might be populated
    const userId = req.user?.id;
    return this.ordersService.createOrderFromCart(guestToken, userId, checkoutData, checkoutData.couponCode);
  }
}
