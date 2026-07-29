import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [DatabaseModule, CartsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
