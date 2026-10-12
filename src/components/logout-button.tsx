'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function logout() {
        if (loading) return

        setLoading(true)

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin'
            })


            if (!response.ok) {
                throw new Error('Logout failed')
            }

            router.replace('/login')
            router.refresh()
        } catch (e) {
            setLoading(false)
            alert('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง')
        }
    }
    return (
        <button
            type="button"
            className="sideitem"
            onClick={logout}
            disabled={loading}
            style={{
                width: '100%',
                border: 0,
                background: 'transparent',
                textAlign: 'left',
                cursor: loading ? 'wait' : 'pointer',
            }}
        >
            {loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
        </button>
    );
}