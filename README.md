# Hệ thống Điểm Tích Lũy

## Cài đặt Local

1. Clone repo
2. `npm install`
3. Copy `.env.example` thành `.env` và dán DATABASE_URL
4. `npx prisma db push`
5. `npx prisma db seed` (hoặc `npm run prisma:seed`)
6. `npm run dev`

Admin mặc định: username `admin`, pass `admin123`

## Deploy Render.com

1. Push code lên GitHub
2. Tạo Web Service mới trên Render
3. Kết nối repo GitHub
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Thêm Environment Variable: `DATABASE_URL` (từ Neon)

## Tính năng

- Tích điểm: 1.000đ = 1 điểm, làm tròn 500+
- Đổi điểm: 50-10.000 điểm = 500-100.000đ giảm
- Phân quyền: STAFF / MANAGER / ADMIN
- Auto logout cho MANAGER/ADMIN sau 15p không hoạt động
- Xuất CSV lịch sử theo SĐT hoặc ngày
- UI responsive, dark theme