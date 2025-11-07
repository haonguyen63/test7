"use client"
import { useState } from "react"
import CustomerSearch from "@/components/CustomerSearch"
import PointCalculator from "@/components/PointCalculator"
import { useSession } from "next-auth/react"
import AutoLogout from "@/components/AutoLogout"

export default function POS() {
  const { data: session } = useSession()
  const [customer, setCustomer] = useState(null)

  return (
    <>
      <AutoLogout />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Điểm bán hàng</h1>
        {session && (
          <p className="text-cyan-400 mb-4">Đăng nhập: {session.user?.name}</p>
        )}

        <CustomerSearch onCustomer={setCustomer} />

        {customer && (
          <>
            <div className="bg-gray-800 p-4 rounded-lg mb-6 text-white">
              <p className="text-xl">
                {customer.name} - {customer.phone} - Số dư điểm:{" "}
                <span className="text-cyan-400">
                  {customer.points.toLocaleString()}
                </span>
              </p>
            </div>
            <PointCalculator customer={customer} />
          </>
        )}
      </div>
    </>
  )
}