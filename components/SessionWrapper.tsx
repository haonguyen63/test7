// components/SessionWrapper.tsx
'use client'; // ← QUAN TRỌNG: Đây là Client Component

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
