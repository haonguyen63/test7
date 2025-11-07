"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function Export() {
  const { data: session } = useSession()
  const [phone, setPhone] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleExport = async () => {
    const params = new URLSearchParams({ phone, startDate, endDate })
    const response = await fetch(`/api/export?${params}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lich-su.csv"
    a.click()
  }

  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    return <p>Không có quyền truy cập</p>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Xuất CSV</h1>
      <input
        placeholder="SĐT khách (tùy chọn)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 bg-gray-700 rounded mb-2 block"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="p-2 bg-gray-700 rounded mb-2 block"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 bg-gray-700 rounded mb-2 block"
      />
      <button onClick={handleExport} className="bg-blue-600 p-2 rounded text-white">
        Xuất CSV
      </button>
    </div>
  )
}