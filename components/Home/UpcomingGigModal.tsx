"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Sparkles, Music, Ticket, Shirt, Utensils, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "drippybanks.promo.upcoming_gig_seen_v1";

export function UpcomingGigModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const hasSeen = localStorage.getItem(STORAGE_KEY);
            if (!hasSeen) {
                // Short 600ms delay for smooth entrance after page hydration
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 600);
                return () => clearTimeout(timer);
            }
        } catch {
            setIsOpen(true);
        }
    }, []);

    const handleDismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
        setIsOpen(false);
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                    {/* Dark Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 26, stiffness: 320 }}
                        className="relative w-full max-w-3xl my-auto rounded-3xl border border-amber-400/20 bg-slate-950 p-5 sm:p-7 shadow-[0_0_90px_rgba(251,191,36,0.15)] text-white z-10 overflow-hidden"
                    >
                        {/* Ambient glow in corner */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            aria-label="Close promotion modal"
                            className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-white/20 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] items-center">
                            {/* Poster Image */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl w-full max-w-[280px] md:max-w-none mx-auto aspect-[3/4]">
                                <Image
                                    src="/upComingGig.jpeg"
                                    alt="Drippy Banks Connect Event Poster - 05 Dec"
                                    fill
                                    priority
                                    unoptimized
                                    sizes="(max-width: 768px) 280px, 360px"
                                    className="object-cover object-top"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-red-600/95 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-red-400/30">
                                    05 DEC
                                </div>
                            </div>

                            {/* Details Content */}
                            <div className="space-y-3.5">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        <Sparkles className="w-3 h-3" />
                                        Official Event Drop
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
                                        Drippy Banks <span className="text-amber-400">Connect</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Nathi & Sipho Presents • Featuring <span className="text-white font-semibold">DJ Sizer</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-[10px] uppercase font-medium">Date</p>
                                            <p className="font-semibold text-white">05 December</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                                        <div className="truncate">
                                            <p className="text-slate-400 text-[10px] uppercase font-medium">Venue</p>
                                            <p className="font-semibold text-white truncate">Elias Nefale Resort</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Package Inclusions Card */}
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/25 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                            <Ticket className="w-3.5 h-3.5" /> All-Inclusive Ticket
                                        </span>
                                        <span className="text-base font-black text-amber-400">R450</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <Utensils className="w-3 h-3 text-amber-300 shrink-0" /> Food & Braai
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Shirt className="w-3 h-3 text-amber-300 shrink-0" /> Free Drippy Tee
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Bus className="w-3 h-3 text-amber-300 shrink-0" /> Transport
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Music className="w-3 h-3 text-amber-300 shrink-0" /> DJ Sizer Set
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Media content creation, streetwear vibes, and networking session.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                    <Button
                                        onClick={handleDismiss}
                                        className="w-full rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs h-10 transition-transform active:scale-95"
                                    >
                                        Explore Collection
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDismiss}
                                        className="w-full sm:w-auto rounded-full border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs h-10"
                                    >
                                        Don&apos;t show again
                                    </Button>
                                </div>

                                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
                                    18+ Drink Responsibly
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
