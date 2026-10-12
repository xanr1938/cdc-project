import 'server-only'

import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import { db } from '@/lib/db'

const COOKIE_NAME = 'cc_session'
const SESSION_DURATION = 60 * 60 * 24 * 1;

function getSecret() {
    const secret = process.env.AUTH_SECRET;

    if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
        throw new Error('AUTH_SECRET must contain at least 32 bytes');
    }

    return new TextEncoder().encode(secret)
}

export async function createSession(userId: string) {
    return new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(getSecret())
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    try {

        const { payload } = await jwtVerify(token, getSecret(), {
            algorithms: ['HS256']
        })

        if (!payload.sub) return null

        const user = await db.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                displayName: true,
                role: true,
                isActive: true
            }
        })

        if (!user || !user.isActive) return null;

        return user;
    } catch {
        return null
    }
}

export async function requireUser() { 
    const user = await getCurrentUser();

    if (!user) redirect('/login')
    
    return user;
}

export async function requireRole(allowedRoles: Array<'ADMIN' | 'TEACHER' | 'REGISTRAR'>) {
    const user = await requireUser()

    if (!allowedRoles.includes(user.role)) {
        throw new Error('FORBIDDEN')
    }

    return user
}

export { COOKIE_NAME, SESSION_DURATION }