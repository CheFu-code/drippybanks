'use client'

import { CategoryGrid } from '@/components/Home/CategoryGrid';
import { FeaturedProducts } from '@/components/Home/FeaturedProducts';
import { Footer } from '@/components/Home/Footer';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';
import { AdvertisingSection } from '@/components/Home/AdvertisingSection';
import { UpcomingGigModal } from '@/components/Home/UpcomingGigModal';
import { Input } from '@/components/ui/input';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { useState } from 'react';

function App() {
    const [email, setEmail] = useState('');
    const { isSubmitting, message, submit } = useNewsletterSubscription();

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const subscribed = await submit(email, 'home-newsletter');
        if (subscribed) {
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-300 selection:text-slate-950">
            <UpcomingGigModal />
            <Navbar />
            <main className="pt-24">
                <Hero />
                <CategoryGrid />
                <AdvertisingSection />
                <FeaturedProducts />

                {/* Newsletter Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                    <div className="bg-slate-900/90 text-white rounded-[2rem] p-10 shadow-2xl ring-1 ring-white/10 overflow-hidden relative">
                        <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
                        <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="relative z-10 mx-auto max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                                Join the Club
                            </h2>
                            <p className="text-slate-300 mb-8 text-lg">
                                Get 10% off your first order and early access to new drops, VIP launches, and exclusive events.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-white placeholder:text-slate-400 border-white/10 bg-white/5"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                            {message && (
                                <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                                    {message.text}
                                </p>
                            )}
                            <p className="mt-4 text-xs text-slate-500">
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
