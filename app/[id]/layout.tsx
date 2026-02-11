'use client'

import { Navbar } from '@/components/Home/Navbar';
import ProfilePage from './profile/page';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                <ProfilePage />
                
            </main>
        </div>
    );
}

export default App;