import { Controller, Get, Post, Body, Put, Param, Request, UseGuards, Headers } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async getCart(
    @Headers('x-guest-token') guestToken?: string,
    @Request() req?: any,
  ) {
    // Try to get user from request if they passed a token, but don't strictly require it
    const userId = req.user?.id; 
    return this.cartsService.getCart(guestToken, userId);
  }

  @Post('items')
  async addItem(
    @Headers('x-guest-token') guestToken: string,
    @Body() body: { variantId: string; quantity: number },
    @Request() req: any,
  ) {
    const cart = await this.cartsService.getCart(guestToken, req.user?.id);
    await this.cartsService.addItem(cart.id, body.variantId, body.quantity);
    return this.cartsService.getCart(cart.guestToken, req.user?.id);
  }

  @Put('items/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartsService.updateItemQuantity(itemId, body.quantity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('merge')
  async mergeCarts(
    @Headers('x-guest-token') guestToken: string,
    @Request() req: any,
  ) {
    return this.cartsService.mergeCarts(guestToken, req.user.id);
  }
}
