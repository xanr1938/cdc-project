import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ศูนย์พัฒนาเด็กเล็ก | ระบบบริการผู้ปกครอง", description: "ข่าวประชาสัมพันธ์และระบบรับสมัครเด็กออนไลน์ของศูนย์พัฒนาเด็กเล็ก" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body>{children}</body></html>; }
