'use client';

import { useState } from 'react';
import CustomerSearch from '@/components/CustomerSearch';
import PointCalculator from '@/components/PointCalculator';
import { Customer } from '@prisma/client';
import { formatVND, formatPoints } from '@/lib/format';


<td className="p-2">{formatVND(order.amount)}</td>
<td className="p-2">{formatPoints(order.pointsEarned)}</td>
export default function POSPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bán hàng & Tích điểm</h1>

      {/* Tìm khách hàng */}
      <CustomerSearch onCustomer={setCustomer} />

      {/* Chỉ hiện khi có khách hàng */}
      {customer && (
        <>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="font-semibold">{customer.name}</p>
            <p>SĐT: {customer.phone}</p>
            <p>Điểm hiện tại: {customer.points.toLocaleString()}</p>
          </div>

          <PointCalculator customer={customer} onSuccess={() => setCustomer(null)} />
        </>
      )}
    </div>
  );
}
