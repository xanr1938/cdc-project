'use client'

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (loading) return

        setError('');
        setLoading(true)


        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ email, password })
            })

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'เข้าสู่ระบบไม่สำเร็จ')
                return
            }

            router.replace('/dashboard')
            router.refresh();
        } catch {
            setError('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองอีกครั้ง');
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <SiteHeader />
            <main className="container">
                <section className="pagehead">
                    <div className="eyebrow">STAFF PORTAL</div>
                    <h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
                    <p className="muted">
                        สำหรับครู เจ้าหน้าที่ทะเบียน และผู้ดูแลระบบที่ได้รับบัญชีจากหน่วยงาน
                    </p>
                </section>

                <section className="loginbox card">
                    <div className="notice">
                        ใช้บัญชีที่ได้รับจากผู้ดูแลระบบเท่านั้น ไม่มีการสมัครสมาชิกสาธารณะ
                    </div>

                    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                        <div className="field">
                            <label htmlFor="email">อีเมลเจ้าหน้าที่</label>
                            <input
                                className="input"
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                placeholder="staff@example.go.th"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                maxLength={254}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="field" style={{ marginTop: 16 }}>
                            <label htmlFor="password">รหัสผ่าน</label>
                            <input
                                className="input"
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                maxLength={128}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p role="alert" style={{ color: '#d44242', marginTop: 16 }}>
                                {error}
                            </p>
                        )}

                        <button
                            className="btn"
                            type="submit"
                            disabled={loading}
                            style={{ marginTop: 20, width: '100%' }}
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>
                </section>
            </main>
            <SiteFooter />
        </>
    );
}