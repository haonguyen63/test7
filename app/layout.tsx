// app/layout.tsx
import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import AutoLogout from '@/components/AutoLogout';
import SessionWrapper from '@/components/SessionWrapper';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tích Điểm Pro',
  description: 'Hệ thống tích điểm khách hàng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${poppins.variable}`}>
      <body className={`${inter.className} font-sans bg-black text-white`}>
        <SessionWrapper>
          <Navbar />
          {children}
          <AutoLogout />
        </SessionWrapper>
      </body>
    </html>
  );
}
