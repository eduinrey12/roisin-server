import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { CartsModule } from '../carts/carts.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [DatabaseModule, CartsModule, PromotionsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
