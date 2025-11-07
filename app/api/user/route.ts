import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user.role as string;
  if (!['MANAGER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { name, phone, password, role: newRole } = body;

  if (!name || !phone || !password || !newRole) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      hashedPassword: hashed,
      role: newRole,
      managedBy: session.user.id as string,
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, phone: user.phone, role: user.role });
}
