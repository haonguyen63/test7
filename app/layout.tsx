import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import AutoLogout from '@/components/AutoLogout';
import SessionWrapper from '@/components/SessionWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hệ thống tích điểm khách hàng',
  description: 'Hệ thống tích điểm khách hàng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black text-white`}>
        <SessionWrapper>
          <Navbar />
          {children}
          <AutoLogout />
        </SessionWrapper>
      </body>
    </html>
  );
}
