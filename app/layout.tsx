import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import AutoLogout from '@/components/AutoLogout';
import SessionWrapper from '@/components/SessionWrapper';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Hệ thống tích điểm khách hàng',
  description: 'Hệ thống tích điểm khách hàng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${poppins.variable}`}>
      <body className="font-sans bg-black text-white">
        <SessionWrapper>
          <Navbar />
          {children}
          <AutoLogout />
        </SessionWrapper>
      </body>
    </html>
  );
}

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
