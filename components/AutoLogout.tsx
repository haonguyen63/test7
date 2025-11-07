"use client"
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"

export default function AutoLogout() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session || session.user.role === "STAFF") return

    // Reset timer on activity
    const resetTimer = () => {
      clearTimeout(window.autoLogoutTimer)
      window.autoLogoutTimer = setTimeout(() => {
        alert("Phiên đăng nhập hết hạn do không hoạt động.")
        signOut({ callbackUrl: "/login" })
      }, 15 * 60 * 1000) // 15 minutes
    }

    resetTimer()
    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("keydown", resetTimer)

    return () => {
      clearTimeout(window.autoLogoutTimer)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
    }
  }, [session])

  return null
}