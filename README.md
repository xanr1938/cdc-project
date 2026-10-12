# ระบบเว็บศูนย์พัฒนาเด็กเล็ก — UI Starter v2

โปรเจกต์ Next.js App Router + TypeScript + PostgreSQL + Prisma สำหรับใช้เป็นฐานพัฒนา ไม่ใช่ระบบ Production สำเร็จรูป

## หน้าที่มีในชุดนี้
- `/` หน้าแรก
- `/announcements` ข่าวประชาสัมพันธ์ (ยังเป็น empty state)
- `/apply` UI แบบฟอร์มสมัคร (ยังไม่ส่งข้อมูล)
- `/privacy` โครงร่างประกาศความเป็นส่วนตัว
- `/login` UI Login (ยังไม่ยืนยันตัวตน)
- `/dashboard` ภาพรวมตัวอย่าง
- `/dashboard/applications` รายการใบสมัครตัวอย่าง
- `/dashboard/announcements` UI จัดการข่าวตัวอย่าง
- `/api/health` health check
- Prisma schema สำหรับ User, ChildApplication, Announcement, AuditLog
- PostgreSQL ผ่าน Docker Compose โดย bind พอร์ต localhost

## ติดตั้ง
1. ติดตั้ง Node.js LTS และ Docker Compose
2. คัดลอก `.env.example` เป็น `.env` แล้วตั้ง secret ที่ปลอดภัย
3. `npm install`
4. `docker compose up -d`
5. `npm run db:generate`
6. `npm run db:migrate`
7. `npm run dev`
8. เปิด `http://localhost:3000`

## ข้อจำกัดสำคัญ
หน้า Dashboard ใน Starter นี้ยังไม่ได้ป้องกันด้วย Login; อย่าเปิดให้เข้าถึงจากอินเทอร์เน็ตและอย่าใส่ข้อมูลเด็กจริง ฟอร์มสมัครยังไม่บันทึกข้อมูล ไม่มีระบบอัปโหลดเอกสาร ไม่มีระบบสร้างบัญชีเจ้าหน้าที่ และไม่มี workflow พิมพ์ PDF

## ก่อน Production ต้องพัฒนาต่อ
- Authentication + server-side authorization (RBAC) ทุกหน้าและทุก API
- สร้างบัญชีเจ้าหน้าที่ผ่าน Admin เท่านั้น, MFA, rate limiting
- API รับสมัครด้วย validation ฝั่งเซิร์ฟเวอร์และป้องกัน spam/abuse
- Private object/file storage, scan file, จำกัดชนิด/ขนาด, signed URL อายุสั้น
- หน้าอ่าน/แก้ไขใบสมัครที่ป้องกัน IDOR และบันทึก audit log โดยไม่บันทึกข้อมูลส่วนตัวใน log
- สร้างเอกสาร A4/PDF เฉพาะผู้ได้รับสิทธิ์
- CSRF/session cookie settings, headers, dependency scanning, security tests
- backup แบบเข้ารหัส, ทดสอบ restore, monitoring และนโยบาย retention/PDPA
- ป้องกัน staff subdomain ด้วย VPN หรือ Access policy ควบคู่กับ auth ในแอป

อย่าเผยแพร่ `.env` และอย่าเปิดพอร์ต PostgreSQL ต่ออินเทอร์เน็ต
