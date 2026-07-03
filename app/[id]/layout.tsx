'use client'

import { Navbar } from '@/components/Home/Navbar';
import { ReactNode } from 'react';

function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />
            <main className="pt-24">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
