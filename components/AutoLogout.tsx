'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// Khai báo kiểu cho window.autoLogoutTimer
declare global {
  interface Window {
    autoLogoutTimer?: NodeJS.Timeout;
  }
}

export default function AutoLogout() {
  const router = useRouter();

  useEffect(() => {
    const timeout = 15 * 60 * 1000; // 15 phút

    const resetTimer = () => {
      if (window.autoLogoutTimer) {
        clearTimeout(window.autoLogoutTimer);
      }
      window.autoLogoutTimer = setTimeout(() => {
        alert('Phiên đăng nhập hết hạn do không hoạt động.');
        signOut({ callbackUrl: '/login' });
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Khởi động lần đầu

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (window.autoLogoutTimer) clearTimeout(window.autoLogoutTimer);
    };
  }, [router]);

  return null;
}
