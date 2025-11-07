// components/AutoLogout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

declare global {
  interface Window {
    autoLogoutTimer?: NodeJS.Timeout;
  }
}

export default function AutoLogout() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Chỉ áp dụng cho Admin & Manager
    const role = session?.user?.role;
    if (status === 'loading') return; // Chưa load xong
    if (!role || !['ADMIN', 'MANAGER'].includes(role)) return;

    const timeout = 15 * 60 * 1000; // 15 phút
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        alert('Phiên đăng nhập hết hạn do không hoạt động.');
        signOut({ callbackUrl: '/login' });
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Khởi động

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timer) clearTimeout(timer);
    };
  }, [session, status]); // ← Phụ thuộc session

  return null;
}
