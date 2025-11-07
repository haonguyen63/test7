import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { SessionProvider } from "next-auth/react"
import AutoLogout from '@/components/AutoLogout';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Điểm tích lũy",
  description: "Hệ thống tích điểm khách hàng",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {children}
        <AutoLogout /> {/* Tự động logout nếu không hoạt động */}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className + " bg-black text-white"}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
