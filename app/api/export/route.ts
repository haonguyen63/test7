import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Papa from 'papaparse';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  const where: any = {};

  if (phone) {
    where.customer = { phone: { contains: phone } };
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: true,
      staff: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const csvData = orders.map(order => ({
    'Mã đơn': order.id,
    'Khách hàng': order.customer.name,
    'SĐT': order.customer.phone,
    'Nhân viên': order.staff.name,
    'Tổng tiền': order.amount.toLocaleString('vi-VN'),
    'Điểm tích': order.pointsEarned,
    'Điểm đổi': order.pointsUsed,
    'Giảm giá': order.discount.toLocaleString('vi-VN'),
    'Ngày': order.createdAt.toLocaleDateString('vi-VN'),
  }));

  const csv = Papa.unparse(csvData);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lich-su-tich-diem-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
