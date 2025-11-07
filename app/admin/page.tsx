"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function Admin() {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: "", phone: "", role: "STAFF" as const })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch("/api/user")
    const data = await res.json()
    setUsers(data)
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    })
    fetchUsers()
    setForm({ name: "", phone: "", role: "STAFF" })
  }

  if (!session || session.user.role !== "ADMIN") {
    return <p>Không có quyền</p>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Quản trị User</h1>
      <form onSubmit={createUser} className="bg-gray-800 p-4 rounded mb-4 space-y-2">
        <input
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 bg-gray-700 rounded block"
        />
        <input
          placeholder="SĐT"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 bg-gray-700 rounded block"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as const })}
          className="p-2 bg-gray-700 rounded block"
        >
          <option value="STAFF">Staff</option>
          <option value="MANAGER">Manager</option>
        </select>
        <button type="submit" className="bg-blue-600 p-2 rounded text-white">
          Tạo
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="bg-gray-800 p-2 rounded mb-2">
            {user.name} - {user.phone} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  )
}