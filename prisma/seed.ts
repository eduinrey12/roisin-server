import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const catJoyas = await prisma.category.upsert({
    where: { slug: 'joyas' },
    update: {},
    create: {
      name: 'Joyas',
      slug: 'joyas',
      description: 'Joyas elegantes',
    },
  });

  const catAccesorios = await prisma.category.upsert({
    where: { slug: 'accesorios' },
    update: {},
    create: {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Accesorios para toda ocasión',
    },
  });

  const product1 = await prisma.product.upsert({
    where: { slug: 'anillo-promesa-plata' },
    update: {},
    create: {
      title: 'Anillo de Promesa en Plata',
      slug: 'anillo-promesa-plata',
      description: 'Hermoso anillo de promesa elaborado en plata 925.',
      basePrice: 45.00,
      categoryId: catJoyas.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1605100804763-247f6612d4a5?q=80&w=600&auto=format&fit=crop', isPrimary: true, altText: 'Anillo de promesa' }
        ]
      },
      variants: {
        create: [
          { sku: 'AN-PROM-PL-6', price: 45.00, inventory: { create: { quantity: 10 } } },
          { sku: 'AN-PROM-PL-7', price: 45.00, inventory: { create: { quantity: 5 } } },
        ]
      }
    }
  });

  const group = await prisma.productOptionGroup.create({
    data: {
      name: 'Presentación',
      isMultiSelect: false,
      options: {
        create: [
          { name: 'Sin empaque especial', priceModifier: 0, isDefault: true },
          { name: 'Caja de regalo premium', priceModifier: 5.00 },
          { name: 'Bolsa de terciopelo', priceModifier: 2.50 }
        ]
      }
    }
  });

  await prisma.productOptionGroupAssignment.create({
    data: {
      productId: product1.id,
      groupId: group.id,
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
