// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Tạo admin
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      phone: '0900000000',
      name: 'Administrator',
      hashedPassword: adminHash,
      role: 'ADMIN',
    },
  });

  // Tạo nhân viên mẫu
  const staffHash = await bcrypt.hash('123456', 10);
  await prisma.user.upsert({
    where: { phone: '0911111111' },
    update: {},
    create: {
      phone: '0911111111',
      name: 'Nhân viên A',
      hashedPassword: staffHash,
      role: 'STAFF',
    },
  });

  // Tạo khách hàng mẫu
  await prisma.customer.upsert({
    where: { phone: '0922222222' },
    update: {},
    create: {
      phone: '0922222222',
      name: 'Khách hàng VIP',
      points: 500,
    },
  });

  console.log('DB seeded: admin/admin123, 0911111111/123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
