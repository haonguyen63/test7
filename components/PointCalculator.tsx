'use client';

import { useState } from 'react';
import { Customer } from '@prisma/client';

interface PointCalculatorProps {
  customer: Customer;
  onSuccess: () => void;  // <-- Đảm bảo có prop này
}

export default function PointCalculator({ customer, onSuccess }: PointCalculatorProps) {
  const [amount, setAmount] = useState('');
  const [pointsUsed, setPointsUsed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculatePoints = () => {
    const amt = parseFloat(amount) || 0;
    return Math.round(amt / 1000); // 1.000đ = 1 điểm
  };

  const maxRedeem = Math.min(customer.points, 10000); // Max 10.000 điểm = 100.000đ
  const minRedeem = 50; // Min 50 điểm = 500đ

  const handleSubmit = async () => {
    const amt = parseFloat(amount) || 0;
    const used = parseInt(pointsUsed) || 0;

    if (amt <= 0) return setError('Nhập số tiền');
    if (used > 0 && (used < minRedeem || used > maxRedeem)) {
      return setError(`Đổi điểm từ ${minRedeem} đến ${maxRedeem} điểm`);
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone: customer.phone,
          amount: amt,
          pointsUsed: used,
        }),
      });

      if (!res.ok) throw new Error('Lỗi tích điểm');

      setSuccess('Tích điểm thành công!');
      setAmount('');
      setPointsUsed('');
      onSuccess(); // Gọi callback để reset customer
    } catch (err) {
      setError('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const pointsEarned = calculatePoints();
  const discount = (parseInt(pointsUsed) || 0) * 10; // 1 điểm = 10đ
  const finalAmount = (parseFloat(amount) || 0) - discount;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Tính điểm & Đổi điểm</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tổng tiền (VNĐ)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số tiền..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          {amount && <p className="text-sm text-green-600 mt-1">Tích: {pointsEarned} điểm</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Đổi điểm (tối đa {maxRedeem.toLocaleString()} điểm)
          </label>
          <input
            type="number"
            value={pointsUsed}
            onChange={(e) => setPointsUsed(e.target.value)}
            placeholder="Số điểm muốn đổi..."
            min={minRedeem}
            max={maxRedeem}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {pointsUsed && (
            <p className="text-sm text-blue-600 mt-1">
              Giảm: {discount.toLocaleString()}đ → Thanh toán: {finalAmount.toLocaleString()}đ
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </div>
  );
}
