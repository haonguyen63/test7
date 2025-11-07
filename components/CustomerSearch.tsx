"use client"
import { useState } from "react"

interface Customer {
  id: string
  phone: string
  name: string
  points: number
}

interface Props {
  onCustomer: (customer: Customer) => void
}

export default function CustomerSearch({ onCustomer }: Props) {
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [msg, setMsg] = useState("")

  const search = async () => {
    if (!phone) return
    const res = await fetch(`/api/customer?phone=${phone}`)
    const data = await res.json()
    if (data.found) {
      onCustomer(data.customer)
      setMsg("")
    } else {
      setMsg("Khách mới – nhập tên để tạo")
      setName("")
    }
  }

  const create = async () => {
    if (!name || !phone) return
    const res = await fetch("/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name }),
    })
    if (res.ok) {
      const cust = await res.json()
      onCustomer(cust)
      setMsg("Tạo khách thành công!")
    } else {
      setMsg("Lỗi tạo khách")
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="tel"
          placeholder="Số điện thoại khách"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="p-3 rounded-lg bg-gray-700 text-white w-full"
          maxLength={11}
        />
        <input
          placeholder="Tên khách (nếu tạo mới)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white w-full"
          disabled={!!msg && !msg.includes("mới")}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={search} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex-1"
        >
          Tìm khách
        </button>
        <button 
          onClick={create} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex-1"
          disabled={!msg || !msg.includes("mới")}
        >
          Tạo khách mới
        </button>
      </div>
      {msg && <p className={`mt-3 p-2 rounded ${msg.includes("thành") ? "text-green-400" : "text-yellow-400"}`}>{msg}</p>}
    </div>
  )
}