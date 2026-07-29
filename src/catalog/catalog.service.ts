import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CatalogService {
  constructor(private readonly db: DatabaseService) {}

  async getCategories() {
    return this.db.category.findMany({
      where: { isActive: true },
      include: { children: true }
    });
  }

  async getProducts(params?: { categorySlug?: string; query?: string }) {
    return this.db.product.findMany({
      where: {
        isActive: true,
        ...(params?.categorySlug && { category: { slug: params.categorySlug } }),
        ...(params?.query && {
          OR: [
            { title: { contains: params.query, mode: 'insensitive' } },
            { description: { contains: params.query, mode: 'insensitive' } },
          ]
        })
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } }
      }
    });
  }

  async getProductBySlug(slug: string) {
    return this.db.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { 
          where: { isActive: true },
          include: { attributes: { include: { attributeValue: { include: { attribute: true } } } } }
        },
        optionGroupLinks: {
          include: { group: { include: { options: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } } } }
        }
      }
    });
  }
}
