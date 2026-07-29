import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PromotionsService],
  controllers: [PromotionsController],
  exports: [PromotionsService]
})
export class PromotionsModule {}
