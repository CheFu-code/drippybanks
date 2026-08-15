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
                const timer = setTimeout(() => setIsOpen(true), 600);
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
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleDismiss}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 28, stiffness: 340 }}
                        className="relative w-full sm:max-w-2xl z-10 overflow-hidden
                            rounded-t-3xl sm:rounded-3xl
                            border-t border-white/10 sm:border border-white/10
                            bg-slate-950
                            shadow-[0_-20px_80px_rgba(251,191,36,0.08)] sm:shadow-[0_0_80px_rgba(251,191,36,0.12)]"
                    >
                        {/* Ambient glows */}
                        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-red-500/8 blur-3xl" />

                        {/* Mobile drag handle */}
                        <div className="flex justify-center pt-3 sm:hidden">
                            <div className="h-1 w-10 rounded-full bg-white/20" />
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            aria-label="Close promotion"
                            className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 border border-white/15 text-slate-400 hover:text-white transition"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        {/* ── MOBILE LAYOUT ── */}
                        <div className="sm:hidden px-4 pt-2 pb-5 space-y-3">
                            {/* Top row: poster + title */}
                            <div className="flex gap-3 pr-8">
                                {/* Poster — small but proper */}
                                <div className="relative shrink-0 w-[72px] rounded-xl overflow-hidden border border-white/10 shadow-lg" style={{ aspectRatio: "3/4" }}>
                                    <Image
                                        src="/upComingGig.jpeg"
                                        alt="Drippy Banks Connect"
                                        fill
                                        unoptimized
                                        priority
                                        sizes="72px"
                                        className="object-cover object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-1.5 left-1.5 bg-red-600/95 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                                        05 DEC
                                    </div>
                                </div>

                                {/* Title + meta */}
                                <div className="min-w-0 pt-0.5">
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Event Drop
                                    </div>
                                    <h3 className="text-base font-black tracking-tight text-white uppercase leading-tight">
                                        Drippy Banks <span className="text-amber-400">Connect</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Featuring <span className="text-white font-medium">DJ Sizer</span>
                                    </p>
                                    <div className="flex gap-1.5 mt-2 flex-wrap">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px]">
                                            <Calendar className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                            <span className="text-white font-medium">05 Dec</span>
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] min-w-0">
                                            <MapPin className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                            <span className="text-white font-medium truncate">Elias Nefale Resort</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket price + inclusions */}
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-400/10 to-transparent border border-amber-400/20">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300 flex items-center gap-1">
                                        <Ticket className="w-3 h-3" /> All-Inclusive
                                    </span>
                                    <span className="text-sm font-black text-amber-400">R450</span>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1"><Utensils className="w-2.5 h-2.5 text-amber-300" />Food & Braai</span>
                                    <span className="flex items-center gap-1"><Shirt className="w-2.5 h-2.5 text-amber-300" />Free Tee</span>
                                    <span className="flex items-center gap-1"><Bus className="w-2.5 h-2.5 text-amber-300" />Transport</span>
                                    <span className="flex items-center gap-1"><Music className="w-2.5 h-2.5 text-amber-300" />DJ Sizer Set</span>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-2 pt-0.5">
                                <Button
                                    onClick={handleDismiss}
                                    className="flex-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs h-9"
                                >
                                    Explore Collection
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDismiss}
                                    className="rounded-full border-white/15 text-slate-400 hover:text-white hover:bg-white/5 text-xs h-9 px-3"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>

                        {/* ── DESKTOP LAYOUT ── */}
                        <div className="hidden sm:grid sm:grid-cols-[220px_1fr] gap-0">
                            {/* Poster */}
                            <div className="relative overflow-hidden rounded-l-3xl">
                                <Image
                                    src="/upComingGig.jpeg"
                                    alt="Drippy Banks Connect - 05 Dec"
                                    fill
                                    unoptimized
                                    priority
                                    sizes="220px"
                                    className="object-cover object-top"
                                />
                                <div className="absolute top-3 left-3 bg-red-600/95 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-red-400/30">
                                    05 DEC
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        <Sparkles className="w-3 h-3" />
                                        Official Event Drop
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-white uppercase leading-tight">
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
                                        <div className="min-w-0">
                                            <p className="text-slate-400 text-[10px] uppercase font-medium">Venue</p>
                                            <p className="font-semibold text-white truncate">Elias Nefale Resort</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/25 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                            <Ticket className="w-3.5 h-3.5" /> All-Inclusive Ticket
                                        </span>
                                        <span className="text-base font-black text-amber-400">R450</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                                        <div className="flex items-center gap-1.5"><Utensils className="w-3 h-3 text-amber-300 shrink-0" /> Food & Braai</div>
                                        <div className="flex items-center gap-1.5"><Shirt className="w-3 h-3 text-amber-300 shrink-0" /> Free Drippy Tee</div>
                                        <div className="flex items-center gap-1.5"><Bus className="w-3 h-3 text-amber-300 shrink-0" /> Transport</div>
                                        <div className="flex items-center gap-1.5"><Music className="w-3 h-3 text-amber-300 shrink-0" /> DJ Sizer Set</div>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-0.5">
                                    <Button
                                        onClick={handleDismiss}
                                        className="flex-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs h-10"
                                    >
                                        Explore Collection
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDismiss}
                                        className="rounded-full border-white/15 text-slate-300 hover:text-white hover:bg-white/5 text-xs h-10 px-4"
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
