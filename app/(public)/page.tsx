'use client'

import { CategoryGrid } from '@/components/Home/CategoryGrid';
import { FeaturedProducts } from '@/components/Home/FeaturedProducts';
import { Footer } from '@/components/Home/Footer';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';

function App() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-16">
                <Hero />
                <CategoryGrid />
                <FeaturedProducts />

                {/* Newsletter Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                    <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-16 relative overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-800 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-700 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50 pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Join the Club</h2>
                            <p className="text-gray-300 mb-8 text-lg">
                                Get 15% off your first order when you sign up for our newsletter. Plus, get early access to new drops and exclusive events.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                            <p className="mt-4 text-xs text-gray-400">
                                By subscribing you agree to our Terms & Conditions and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default App;