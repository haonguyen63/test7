// app/export/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatVND, formatPoints } from '@/lib/format';

interface Order {
  id: string;
  amount: number;
  pointsEarned: number;
  createdAt: string;
  customer: { name: string; phone: string };
}

export default function Export() {
  const { data: session } = useSession();
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    if (!phone && !startDate && !endDate) {
      setError('Nhập ít nhất 1 điều kiện');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (phone) params.append('phone', phone);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/export?${params}`);
      if (!res.ok) throw new Error('Lỗi server');

      const data: Order[] = await res.json();

      // Tạo CSV
      const headers = ['Ngày', 'Khách hàng', 'SĐT', 'Tiền (đ)', 'Điểm tích'];
      const rows = data.map(o => [
        new Date(o.createdAt).toLocaleDateString('vi-VN'),
        o.customer.name,
        o.customer.phone,
        formatVND(o.amount),
        formatPoints(o.pointsEarned),
      ]);

      const csvContent = [headers, ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lich-su-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Xuất thất bại. Thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return <p className="p-8 text-red-400">Không có quyền truy cập</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Xuất CSV Lịch sử</h1>
      <div className="space-y-4">
        <input
          placeholder="SĐT khách (tùy chọn)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded text-white"
          disabled={loading}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded text-white"
          disabled={loading}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded text-white"
          disabled={loading}
        />
        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded disabled:opacity-50"
        >
          {loading ? 'Đang xuất...' : 'Xuất CSV'}
        </button>
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}
