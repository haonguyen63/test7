import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản trị hệ thống</h1>
      <p>Xin chào, <strong>{session.user.name}</strong> (Admin)</p>
      <p>SĐT: {session.user.phone}</p>
      {/* Thêm UI: tạo manager, reset mật khẩu, xem log... */}
    </div>
  );
}
