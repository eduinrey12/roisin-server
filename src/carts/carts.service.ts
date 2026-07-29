import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartsService {
  constructor(private db: DatabaseService) {}

  async getCart(guestToken?: string, userId?: string) {
    let cart = null;
    if (userId) {
      cart = await this.db.cart.findFirst({ where: { userId }, include: { items: { include: { variant: { include: { product: true } }, options: true } } } });
    } else if (guestToken) {
      cart = await this.db.cart.findUnique({ where: { guestToken }, include: { items: { include: { variant: { include: { product: true } }, options: true } } } });
    }

    if (!cart) {
      const token = userId ? null : (guestToken || uuidv4());
      cart = await this.db.cart.create({
        data: { guestToken: token, userId },
        include: { items: { include: { variant: { include: { product: true } }, options: true } } }
      });
    }

    return cart;
  }

  async addItem(cartId: string, variantId: string, quantity: number) {
    const existing = await this.db.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } }
    });

    if (existing) {
      return this.db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.db.cartItem.create({
      data: { cartId, variantId, quantity },
    });
  }

  async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.db.cartItem.delete({ where: { id: itemId } });
    }
    return this.db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async mergeCarts(guestToken: string, userId: string) {
    const guestCart = await this.db.cart.findUnique({ where: { guestToken }, include: { items: true } });
    if (!guestCart) return this.getCart(null, userId);

    let userCart = await this.db.cart.findFirst({ where: { userId } });
    if (!userCart) {
      // Just assign the guest cart to the user
      return this.db.cart.update({
        where: { id: guestCart.id },
        data: { guestToken: null, userId },
      });
    }

    // Merge items
    for (const item of guestCart.items) {
      await this.addItem(userCart.id, item.variantId, item.quantity);
    }
    await this.db.cart.delete({ where: { id: guestCart.id } });
    return this.getCart(null, userId);
  }
}
