
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      phone: '1234567890',
      password: 'password',
      role: 'admin'
    },
  });

  await prisma.customer.create({
    data: {
      phone: '0987654321',
      name: 'John Doe',
      points: 100
    },
  });

  console.log("Seed data created");
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
