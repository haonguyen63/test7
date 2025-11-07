// app/pos/page.tsx
'use client';

import { useState } from 'react';
import CustomerSearch from '@/components/CustomerSearch';
import PointCalculator from '@/components/PointCalculator';
import { Customer } from '@prisma/client';
import { formatPoints } from '@/lib/format';

export default function POSPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Bán hàng & Tích điểm</h1>

      <CustomerSearch onCustomer={setCustomer} />

      {customer && (
        <>
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5 rounded-xl mb-6 shadow-lg">
            <p className="text-xl font-bold text-yellow-300">{customer.name || 'Khách vãng lai'}</p>
            <p className="text-gray-200">SĐT: <span className="font-mono">{customer.phone}</span></p>
            <p className="text-2xl font-bold text-green-300">
              Điểm: {formatPoints(customer.points)}
            </p>
          </div>

          <PointCalculator
            customer={customer}
            onSuccess={() => setCustomer(null)}
          />
        </>
      )}
    </div>
  );
}
