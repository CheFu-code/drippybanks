'use client'

import { Navbar } from '@/components/Home/Navbar';
import { ReactNode } from 'react';

function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
