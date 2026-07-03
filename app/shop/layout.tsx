'use client'

import { Navbar } from '@/components/Home/Navbar';
import ShopPage from './page';

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />
            <main className="pt-24 px-5">
                <ShopPage />
            </main>
        </div>
    );
}

export default App;