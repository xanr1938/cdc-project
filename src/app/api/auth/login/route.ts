import { NextResponse } from "next/server";
import { compare } from 'bcryptjs'
import { email, z } from 'zod'
import { db } from '@/lib/db'
import { COOKIE_NAME, SESSION_DURATION, createSession } from '@/lib/auth'

export const runtime = 'nodejs';

const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) })

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง ' },
                { status: 400 }
            )
        }

        const email = parsed.data.email.toLowerCase();
        const passowrd = parsed.data.password;

        const user = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                passwordHash: true,
                isActive: true
            }
        })

        if (!user || !user.isActive || !(await compare(passowrd, user.passwordHash))) {
            return NextResponse.json(
                { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกปิดใช้งาน' },
                { status: 401 },
            )
        }

        const token = await createSession(user.id);

        const response = NextResponse.json({ ok: true})

        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_DURATION,
        })

        response.headers.set('Cache-Control', 'no-store');

        return response;
    } catch (e) { 
        console.error('Login Error:', e)

        return NextResponse.json(
            { error: 'ระบบเข้าสู่ระบบขัดข้อง กรุณาลองใหม่ภายหลัง'},
            { status: 500}
        )
    }
}