
'use client'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();

    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
                <Image
                    fill
                    priority
                    src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury streetwear"
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/65 to-rose-950/55" />
            </div>

            <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200/80">
                            New season drop
                        </p>
                        <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Streetwear redefined for the modern premium wardrobe.
                        </h1>
                        <p className="max-w-2xl text-lg leading-8 text-slate-300">
                            Explore bold silhouettes, elevated essentials, and a curated collection designed to stand out on every city corner.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="flex flex-col gap-4 sm:flex-row"
                    >
                        <button
                            type="button"
                            onClick={() => router.push('/shop')}
                            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-300"
                        >
                            Shop the edit
                            <ArrowRight size={18} className="ml-3" />
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/wishlist')}
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:border-white/25 hover:bg-white/10"
                        >
                            View the wishlist
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
