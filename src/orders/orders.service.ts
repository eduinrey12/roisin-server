import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CartsService } from '../carts/carts.service';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class OrdersService {
  constructor(
    private db: DatabaseService,
    private cartsService: CartsService,
    private promotionsService: PromotionsService
  ) {}

  async createOrderFromCart(
    guestToken: string, 
    userId: string | undefined, 
    checkoutData: any,
    couponCode?: string
  ) {
    const cart = await this.cartsService.getCart(guestToken, userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += Number(item.variant.price) * item.quantity;
    });

    let discount = 0;
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await this.promotionsService.validateCoupon(couponCode);
      discount = subtotal * (validCoupon.discountPercentage / 100);
    }

    const shippingCost = checkoutData.shippingCost || 0;
    const total = subtotal - discount + shippingCost;

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
        discount,
        total,
        couponId: validCoupon?.id,
        items: {
          create: cart.items.map(item => ({
            quantity: item.quantity,
            price: Number(item.variant.price),
            variant: { connect: { id: item.variantId } }
          }))
        }
      }
    });

    if (validCoupon) {
      await this.db.coupon.update({
        where: { id: validCoupon.id },
        data: { currentUses: { increment: 1 } }
      });
    }

    // Clear cart after order
    await this.db.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }
}
