'use client'

import { Navbar } from '@/components/Home/Navbar';
import ShopPage from './page';

function App() {
    return (
        <div className="min-h-screen p-5 bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                <ShopPage />
            </main>
        </div>
    );
}

export default App;