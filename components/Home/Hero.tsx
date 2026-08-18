"use client";

import { ArrowUpRight, Check, Heart, MoveRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";


const editorialEase = [0.22, 1, 0.36, 1] as const;

export function Hero() {
    const router = useRouter();
    const reduceMotion = useReducedMotion();

    const reveal = (delay = 0) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, delay, ease: editorialEase },
    });

    return (
        <section className="relative isolate overflow-hidden bg-slate-950 text-white">
            <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:52px_52px]" />
            <div className="pointer-events-none absolute -left-24 top-0 size-100 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative mx-auto grid min-h-[min(760px,calc(100dvh-7rem))] max-w-7xl items-stretch px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,0.86fr)] lg:px-8 lg:py-8">
                <div className="flex min-h-[570px] flex-col justify-between py-7 sm:min-h-[610px] sm:py-10 lg:min-h-0 lg:py-14">
                    <motion.div {...reveal()} className="flex items-center gap-3">
                        <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_0_5px_rgba(251,191,36,0.1)]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-amber-300 sm:text-xs">
                            New season / drop 01
                        </p>
                    </motion.div>

                    <div className="my-auto max-w-2xl py-12 sm:py-14 lg:py-0">
                        <motion.p {...reveal(0.08)} className="mb-5 text-xs font-semibold uppercase tracking-[0.19em] text-slate-300">
                            Made for the after-hours city
                        </motion.p>
                        <motion.h1
                            {...reveal(0.14)}
                            className="max-w-xl text-5xl font-semibold leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[5.45rem]"
                        >
                            Dress like the night is yours.
                        </motion.h1>
                        <motion.p {...reveal(0.22)} className="mt-7 max-w-lg text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                            Sharp layers, quiet confidence, and the pieces that carry you
                            from first plans to last call.
                        </motion.p>
                        <motion.div {...reveal(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={() => router.push("/shop")}
                                className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-amber-400 px-6 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-amber-300 focus-visible:outline-amber-200"
                            >
                                Shop now
                                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/wishlist")}
                                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-100 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                            >
                                <Heart className="size-4 transition group-hover:fill-amber-300 group-hover:text-amber-300" aria-hidden="true" />
                                Your wish list
                            </button>
                        </motion.div>
                    </div>

                    <motion.div {...reveal(0.4)} className="hidden max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-5 sm:grid">
                        <HeroNote value="01" label="Curated drops" />
                        <HeroNote value="24h" label="Dispatch window" />
                        <HeroNote value="SA" label="Built local" />
                    </motion.div>
                </div>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 18 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.85, delay: 0.16, ease: editorialEase }}
                    className="relative mb-1 min-h-[455px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/50 sm:min-h-[530px] lg:mb-0 lg:min-h-0"
                >
                    <Image
                        fill
                        priority
                        src={'/newPic/ad-03.jpeg'}
                        alt="Model wearing Drippy Banks streetwear"
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        className="object-cover object-center saturate-[0.88] contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
                        <span className="rounded-full border border-white/18 bg-black/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                            The midnight edit
                        </span>
                        
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <div className="border-l-2 border-amber-400 pl-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Featured right now</p>
                            <p className="mt-2 max-w-sm text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                                Dark tones. Defined silhouettes. Zero compromise.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push("/shop")}
                            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:text-amber-300"
                        >
                            Explore collection
                            <MoveRight className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="relative border-t border-white/10 bg-slate-950/80">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p className="inline-flex items-center gap-2 font-medium text-slate-300">
                        <Check className="size-3.5 text-amber-300" aria-hidden="true" />
                        Elevated essentials, delivered across South Africa.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Drippy Banks / 2025</p>
                </div>
            </div>
        </section>
    );
}

function HeroNote({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        </div>
    );
}
