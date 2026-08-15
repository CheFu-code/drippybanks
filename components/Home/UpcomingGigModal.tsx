"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Sparkles, Music, Ticket, Shirt, Utensils, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "drippybanks.promo.upcoming_gig_seen_v1";

export function UpcomingGigModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        try {
            const hasSeen = localStorage.getItem(STORAGE_KEY);
            if (!hasSeen) {
                // Short polite delay for smooth page entrance
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1200);
                return () => clearTimeout(timer);
            }
        } catch {
            // localStorage unavailable (e.g. private mode)
        }
    }, []);

    const handleDismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-8 shadow-[0_0_80px_rgba(251,191,36,0.15)] text-white z-10"
                    >
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            aria-label="Close promotion modal"
                            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="grid gap-6 md:grid-cols-[1.1fr_1.3fr] items-center">
                            {/* Poster Image Container */}
                            <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-slate-900/90 shadow-2xl aspect-[3/4] max-h-[460px] w-full mx-auto">
                                <Image
                                    src="/upComingGig.jpeg"
                                    alt="Drippy Banks Connect Event Poster - 05 Dec"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 420px"
                                    onLoad={() => setImageLoaded(true)}
                                    className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                                        imageLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 animate-pulse">
                                        <Sparkles className="w-8 h-8 text-amber-400/50" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-red-400/30">
                                    05 DEC
                                </div>
                            </div>

                            {/* Details & Copy */}
                            <div className="space-y-4">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Official Event Announcement
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                                        Drippy Banks <span className="text-amber-400">Connect</span>
                                    </h3>
                                    <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">
                                        Nathi & Sipho Presents • Featuring <span className="text-white font-semibold">DJ Sizer</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 text-xs">
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-[10px] uppercase">Date</p>
                                            <p className="font-semibold text-white">05 December</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                                        <div className="truncate">
                                            <p className="text-slate-400 text-[10px] uppercase">Venue</p>
                                            <p className="font-semibold text-white truncate">The Elias Nefale Resort</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Package Inclusions */}
                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/20 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                            <Ticket className="w-3.5 h-3.5" /> All-Inclusive Ticket
                                        </span>
                                        <span className="text-lg font-black text-amber-400">R450</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <Utensils className="w-3 h-3 text-amber-300" /> Food & Braai Session
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Shirt className="w-3 h-3 text-amber-300" /> Free Drippybanks Tee
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Bus className="w-3 h-3 text-amber-300" /> Transport Included
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Music className="w-3 h-3 text-amber-300" /> DJ Sizer Live Set
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Join us for an exclusive day of networking, media content creation, and street culture vibes.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Button
                                        onClick={handleDismiss}
                                        className="w-full rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm h-11 transition-transform active:scale-95"
                                    >
                                        Explore Streetwear Drop
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDismiss}
                                        className="w-full sm:w-auto rounded-full border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs h-11"
                                    >
                                        Don&apos;t show again
                                    </Button>
                                </div>

                                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest pt-1">
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
