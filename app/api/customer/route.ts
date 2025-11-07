import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")
  if (!phone) {
    return NextResponse.json({ error: "Missing phone" }, { status: 400 })
  }

  const customer = await prisma.customer.findUnique({ where: { phone } })
  if (!customer) {
    return NextResponse.json({ found: false })
  }
  return NextResponse.json({ found: true, customer })
}

export async function POST(request: Request) {
  try {
    const { phone, name } = await request.json()
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name },
      create: { phone, name, points: 0 },
    })
    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: "Error creating customer" }, { status: 500 })
  }
}