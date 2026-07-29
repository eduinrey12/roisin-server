import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class OrdersService {
  constructor(
    private db: DatabaseService,
    private cartsService: CartsService,
  ) {}

  async createOrderFromCart(
    guestToken: string, 
    userId: string | undefined, 
    checkoutData: any
  ) {
    const cart = await this.cartsService.getCart(guestToken, userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += Number(item.variant.price) * item.quantity;
    });

    const shippingCost = checkoutData.shippingCost || 0;
    const total = subtotal + shippingCost;

    const orderNumber = `ROI-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await this.db.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail: checkoutData.email,
        customerName: `${checkoutData.firstName} ${checkoutData.lastName}`,
        customerPhone: checkoutData.phone,
        shippingAddress: checkoutData.address,
        city: checkoutData.city,
        province: checkoutData.province,
        subtotal,
        shippingCost,
        total,
        items: {
          create: cart.items.map(item => ({
            quantity: item.quantity,
            price: Number(item.variant.price),
            variant: { connect: { id: item.variantId } }
          }))
        }
      }
    });

    // Clear cart after order
    await this.db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }
}
