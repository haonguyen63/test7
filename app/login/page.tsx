"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", {
      identifier,
      password,
      callbackUrl: "/pos",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-4 w-80">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <input
          type="text"
          placeholder="Username hoặc SĐT"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
          required
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded text-white">
          Đăng nhập
        </button>
      </form>
    </div>
  )
}