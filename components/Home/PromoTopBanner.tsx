'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, Sparkles, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { PromoShareModal } from './PromoShareModal';
import { DEFAULT_PROMO_CODE, DEFAULT_PROMO_DISCOUNT } from '@/lib/promo';

export function PromoTopBanner() {
    const [isDismissed, setIsDismissed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isDismissed) return null;

    return (
        <>
            <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 py-2 px-4 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                            <Flame size={12} className="text-amber-400" /> WhatsApp Drop
                        </span>
                        <span>
                            💰 <strong>{DEFAULT_PROMO_DISCOUNT}% OFF Coupon</strong> for new users only! Code: <span className="font-mono font-black bg-slate-950/20 px-1.5 py-0.5 rounded text-slate-950">{DEFAULT_PROMO_CODE}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm"
                        >
                            <FaWhatsapp size={13} className="text-emerald-400" /> Share on WhatsApp
                        </button>

                        <Link
                            href="/promo"
                            className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                        >
                            <Sparkles size={12} /> Claim Offer
                        </Link>

                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-1 rounded-full hover:bg-slate-950/20 text-slate-950 transition-colors"
                            aria-label="Dismiss banner"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            </div>

            <PromoShareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                promoCode={DEFAULT_PROMO_CODE}
                discountPercent={DEFAULT_PROMO_DISCOUNT}
            />
        </>
    );
}
