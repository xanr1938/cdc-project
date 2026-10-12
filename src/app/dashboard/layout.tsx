import Link from "next/link";
import { requireUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import React from "react";

const roleLabels: Record<string, string> = {
    ADMIN: 'ผู้ดูแลระบบ',
    TEACHER: 'ครู',
    REGISTRAR: 'เจ้าหน้าที่ทะเบียน'
}

export default async function DashboardLayout({ children, }: { children: React.ReactNode; }) {
    const user = await requireUser();

    return (
        <div className="container">
            <div className="dashboard">
                <aside className="sidebar">
                    <strong style={{ display: 'block', padding: 12 }}>
                        เมนูเจ้าหน้าที่
                    </strong>

                    <div style={{ padding: 12 }}>
                        <div>{user.displayName}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                            {roleLabels[user.role] ?? user.role}
                        </div>
                    </div>

                    <Link className="sideitem active" href="/dashboard">
                        ภาพรวม
                    </Link>

                    <Link className="sideitem" href="/dashboard/applications">
                        รายการใบสมัคร
                    </Link>

                    <Link className="sideitem" href="/dashboard/announcements">
                        จัดการประชาสัมพันธ์
                    </Link>

                    <LogoutButton />
                </aside>

                <section>{children}</section>
            </div>
        </div>
    );
}