'use client';

import { useState } from 'react';
import { Customer } from '@prisma/client';

interface CustomerSearchProps {
  onCustomer: (customer: Customer) => void;
}

export default function CustomerSearch({ onCustomer }: CustomerSearchProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/customer?phone=${phone}`);
      if (!res.ok) throw new Error('Không tìm thấy');

      const customer: Customer = await res.json();
      onCustomer(customer);
    } catch (err) {
      setError('Không tìm thấy khách hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Số điện thoại khách hàng</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Nhập SĐT..."
          className="flex-1 px-4 py-2 border rounded-lg"
          disabled={loading}
        />
        <button
          onClick={search}
          disabled={loading || !phone.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang tìm...' : 'Tìm'}
        </button>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
