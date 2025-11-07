'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Sai tài khoản hoặc mật khẩu');
    } else {
      router.push('/pos');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div
          className="bg-[#1e1e1e] rounded-2xl shadow-xl p-8 border border-[#333333]/50"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Đăng nhập
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                Username (hoặc Số điện thoại)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin hoặc 0900000000"
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-[#333333] placeholder-[#666666] focus:outline-none focus:border-[#4f8fff] focus:ring-2 focus:ring-[#4f8fff]/30 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-[#333333] placeholder-[#666666] focus:outline-none focus:border-[#4f8fff] focus:ring-2 focus:ring-[#4f8fff]/30 transition-all duration-200"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 text-sm py-2 px-4 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2563eb] hover:bg-[#3b82f6] text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#2563eb] disabled:hover:shadow-md disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#888888] mt-6">
            Admin: <code className="bg-[#2a2a2a] px-2 py-1 rounded text-[#4f8fff]">admin</code> /{' '}
            <code className="bg-[#2a2a2a] px-2 py-1 rounded text-[#4f8fff]">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
