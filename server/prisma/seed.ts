import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.createMany({
    data: [
      {
        description: 'Salary',
        amount: 3000,
        category: 'Salary',
        date: '2025-04-01',
      },
      {
        description: 'Grocery',
        amount: -50,
        category: 'Food',
        date: '2025-04-02',
      },
      {
        description: 'Coffee',
        amount: -6,
        category: 'Food',
        date: '2025-04-03',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
