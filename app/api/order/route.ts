import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

function roundPoints(amount: number): number {
  const thousands = Math.floor(amount / 1000)
  const remainder = amount % 1000
  return thousands + (remainder >= 500 ? 1 : 0)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
    }

    const { customerId, totalAmount, pointsUsed = 0 } = await request.json()
    const pointsEarned = roundPoints(totalAmount)
    const discount = pointsUsed * 10

    if (pointsUsed < 50 || pointsUsed > 10000) {
      return NextResponse.json({ error: "Điểm đổi không hợp lệ" }, { status: 400 })
    }
    if (discount > 100000) {
      return NextResponse.json({ error: "Max 100.000đ" }, { status: 400 })
    }

    const order = await prisma.$transaction(async (tx) => {
      const cust = await tx.customer.findUnique({ where: { id: customerId } })
      if (!cust || cust.points < pointsUsed) {
        throw new Error("Không đủ điểm")
      }

      await tx.customer.update({
        where: { id: customerId },
        data: { points: { increment: pointsEarned - pointsUsed } },
      })

      return tx.order.create({
        data: {
          customerId,
          staffId: session.user.id,
          totalAmount,
          pointsEarned,
          pointsUsed,
          discount,
        },
      })
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
