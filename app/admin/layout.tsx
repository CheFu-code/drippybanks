'use client'

import { Navbar } from '@/components/Home/Navbar';
import AdminAddProductPage from './products/new/page';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                <AdminAddProductPage />
                
            </main>
        </div>
    );
}

export default App;