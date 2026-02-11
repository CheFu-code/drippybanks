'use client'

import { Navbar } from '@/components/Home/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
