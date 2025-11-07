import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user.role as string;
  if (!['STAFF', 'MANAGER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { customerPhone, amount } = body;

  if (!customerPhone || !amount) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  let customer = await prisma.customer.findUnique({ where: { phone: customerPhone } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: { phone: customerPhone, name: 'Khách mới', staffId: session.user.id as string },
    });
  }

  const pointsEarned = Math.round(amount / 1000);

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      staffId: session.user.id as string,
      amount,
      pointsEarned,
    },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { points: { increment: pointsEarned } },
  });

  return NextResponse.json(order);
}
