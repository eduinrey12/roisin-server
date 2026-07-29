import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ShippingService {
  constructor(private db: DatabaseService) {}

  async getActiveRegions() {
    return this.db.shippingRegion.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  async getRegion(id: string) {
    return this.db.shippingRegion.findUnique({ where: { id } });
  }

  async seedDemoRegions() {
    const count = await this.db.shippingRegion.count();
    if (count === 0) {
      await this.db.shippingRegion.createMany({
        data: [
          { name: 'Quito Centro', baseRate: 3.50 },
          { name: 'Quito Valles (Tumbaco, Cumbayá)', baseRate: 5.00 },
          { name: 'Guayaquil', baseRate: 6.50 },
          { name: 'Resto del País (Servientrega)', baseRate: 7.00 },
        ]
      });
    }
  }
}
