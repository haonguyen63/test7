"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-white">
        Điểm tích lũy
      </Link>
      <div className="flex gap-6 text-cyan-400 items-center">
        {!session ? (
          <Link href="/login" className="hover:underline">
            Đăng nhập
          </Link>
        ) : (
          <>
            <Link href="/pos" className="hover:underline">
              Bán hàng
            </Link>
            {(session.user.role === "MANAGER" || session.user.role === "ADMIN") && (
              <>
                <Link href="/export" className="hover:underline">
                  Xuất CSV
                </Link>
                <Link href="/admin" className="hover:underline">
                  Quản trị
                </Link>
              </>
            )}
            <span className="text-white">Xin chào, {session.user.name}</span>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hover:underline"
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  )
}