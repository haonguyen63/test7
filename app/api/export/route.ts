import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Papa from "papaparse"
import { authOptions } from "../auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  const where: any = {}
  if (phone) {
    where.customer = { phone }
  }
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) where.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59))
  }

  const orders = await prisma.order.findMany({
    where,
    include: { 
      customer: { select: { name: true, phone: true } },
      staff: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  const csvData = orders.map(order => ({
    "ID Đơn": order.id,
    "Khách Hàng": order.customer.name,
    "SĐT": order.customer.phone,
    "Nhân Viên": order.staff.name,
    "Tổng Tiền": order.totalAmount.toLocaleString(),
    "Điểm Tích": order.pointsEarned,
    "Điểm Đổi": order.pointsUsed,
    "Giảm Giá": order.discount.toLocaleString(),
    "Ngày": order.createdAt.toISOString().split('T')[0]
  }))

  const csv = Papa.unparse(csvData)
  return new NextResponse(csv, {
    headers: { 
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="lich-su-tich-diem.csv"'
    }
  })
}