import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { ShippingModule } from './shipping/shipping.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [DatabaseModule, CatalogModule, InventoryModule, AuthModule, UsersModule, CartsModule, OrdersModule, ShippingModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
