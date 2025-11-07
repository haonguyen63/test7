"use client"
import { useState } from "react"

interface Customer {
  id: string
  name: string
  phone: string
  points: number
}

interface Props {
  customer: Customer
}

function roundPoints(amount: number): number {
  const thousands = Math.floor(amount / 1000)
  const remainder = amount % 1000
  return thousands + (remainder >= 500 ? 1 : 0)
}

export default function PointCalculator({ customer }: Props) {
  const [amount, setAmount] = useState("")
  const [pointsUsed, setPointsUsed] = useState("")
  const [finalAmount, setFinalAmount] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)

  const calculate = () => {
    const total = parseInt(amount.replace(/\D/g, "")) || 0
    const used = parseInt(pointsUsed.replace(/\D/g, "")) || 0
    const discount = used * 10
    const earned = roundPoints(total)
    setFinalAmount(total - discount)
    setPointsEarned(earned)
  }

  const suggestions = () => {
    const max = Math.min(customer.points, 10000)
    return [50, 100, 500, 1000, 5000].filter(p => p <= max)
  }

  const createOrder = async () => {
    const total = parseInt(amount.replace(/\D/g, "")) || 0
    const used = parseInt(pointsUsed.replace(/\D/g, "")) || 0
    if (total === 0) return alert("Vui lòng nhập giá trị đơn")

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customer.id,
        totalAmount: total,
        pointsUsed: used,
      }),
    })

    if (res.ok) {
      alert("Tạo đơn thành công! Điểm mới: " + (customer.points + pointsEarned - used))
      window.location.reload()
    } else {
      const error = await res.json()
      alert("Lỗi: " + error.error)
    }
  }

  const formatNumber = (num: number) => num.toLocaleString("vi-VN")

  return (
    <div className="bg-gray-800 p-6 rounded-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Giá trị đơn (VND)</label>
          <input
            type="text"
            placeholder="Nhập số tiền"
            value={formatNumber(parseInt(amount) || 0)}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            className="p-3 rounded-lg bg-gray-700 text-white w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Điểm đổi (tùy chọn)</label>
          <input
            type="text"
            placeholder="Nhập số điểm"
            value={formatNumber(parseInt(pointsUsed) || 0)}
            onChange={(e) => setPointsUsed(e.target.value.replace(/\D/g, ""))}
            onBlur={calculate}
            className="p-3 rounded-lg bg-gray-700 text-white w-full"
          />
        </div>
      </div>
      <div className="text-sm text-gray-400 space-y-1">
        <p>Min 50 điểm (500đ), Max 10.000 điểm (100.000đ). 1 điểm = 10đ giảm giá.</p>
        <p>Điểm tích được: <span className="text-cyan-400">{formatNumber(pointsEarned)}</span> điểm (từ {formatNumber(parseInt(amount) || 0)}đ)</p>
      </div>
      {suggestions().length > 0 && (
        <div>
          <p className="text-sm text-cyan-400">Gợi ý đổi:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions().map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPointsUsed(p.toString())
                  calculate()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                {formatNumber(p)}đ ({p * 10}đ giảm)
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={createOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-xl font-bold"
        disabled={finalAmount < 0 || !amount}
      >
        Tạo đơn hàng - Thanh toán: {formatNumber(finalAmount)}đ
      </button>
    </div>
  )
}