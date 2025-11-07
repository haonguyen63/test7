import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authOptions } from "../auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, phone: true, role: true }
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, phone, role } = await request.json()
    const hash = await bcrypt.hash("default123", 10)
    const user = await prisma.user.create({
      data: { 
        name, 
        phone, 
        password: hash, 
        role,
        username: phone // Use phone as username for staff
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 })
  }
}
