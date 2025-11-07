import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession();

  // Fix: Kiểm tra session và session.user
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản trị hệ thống</h1>
      <p>Xin chào, Admin {session.user.name}</p>
      {/* Thêm UI quản lý: tạo manager, xem log... */}
    </div>
  );
}
