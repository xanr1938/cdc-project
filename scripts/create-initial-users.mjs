
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();

const users = [
  {
    role: 'ADMIN',
    email: process.env.ADMIN_EMAIL,
    name: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD,
  },
  {
    role: 'TEACHER',
    email: process.env.TEACHER_EMAIL,
    name: process.env.TEACHER_NAME,
    password: process.env.TEACHER_PASSWORD,
  },
];

async function main() {
  for (const user of users) {
    if (
      !user.email ||
      !user.name ||
      !user.password ||
      user.password.length < 12 ||
      Buffer.byteLength(user.password, 'utf8') > 72
    ) {
      throw new Error(
        `ข้อมูลบัญชี ${user.role} ไม่ครบ หรือรหัสผ่านไม่อยู่ในช่วงที่กำหนด (12–72 bytes)`,
      );
    }
  }

  const adminEmail = users[0].email.trim().toLowerCase();
  const teacherEmail = users[1].email.trim().toLowerCase();

  if (adminEmail === teacherEmail) {
    throw new Error('ADMIN และ TEACHER ต้องใช้อีเมลคนละบัญชี');
  }

  for (const user of users) {
    const email = user.email.trim().toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      throw new Error(
        `อีเมล ${email} มีบัญชีอยู่แล้ว ยกเลิกโดยไม่แก้ไขบัญชีเดิม`,
      );
    }
  }

  for (const user of users) {
    const email = user.email.trim().toLowerCase();
    const passwordHash = await hash(user.password, 12);

    await db.user.create({
      data: {
        email,
        displayName: user.name.trim(),
        passwordHash,
        role: user.role,
        isActive: true,
      },
    });

    console.log(`สร้างบัญชี ${user.role} สำเร็จ: ${email}`);
  }

  console.log('สร้างบัญชีเริ่มต้นครบแล้ว');
}

main()
  .catch((error) => {
    console.error('ไม่สามารถสร้างบัญชีได้:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
