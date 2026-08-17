'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Sparkles, Download } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'sonner';
import { 
    DEFAULT_PROMO_CODE, 
    DEFAULT_PROMO_DISCOUNT, 
    generateWhatsAppPromoCaption, 
    sharePromoWithImage,
    downloadPromoImage 
} from '@/lib/promo';

interface PromoShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    promoCode?: string;
    discountPercent?: number;
}

export function PromoShareModal({
    isOpen,
    onClose,
    promoCode = DEFAULT_PROMO_CODE,
    discountPercent = DEFAULT_PROMO_DISCOUNT,
}: PromoShareModalProps) {
    const [copiedCaption, setCopiedCaption] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drippybanks.chefuinc.com';
    const promoUrl = `${origin}/promo?code=${promoCode}`;
    const caption = generateWhatsAppPromoCaption({
        code: promoCode,
        discountPercent,
        url: promoUrl,
        storeName: 'Drippy Banks',
    });

    const handleCopyCaption = async () => {
        try {
            await navigator.clipboard.writeText(caption);
            setCopiedCaption(true);
            toast.success('WhatsApp Status text copied! Paste it in your WhatsApp status or chat.');
            setTimeout(() => setCopiedCaption(false), 3000);
        } catch {
            toast.error('Failed to copy text.');
        }
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(promoCode);
            setCopiedCode(true);
            toast.success(`Code ${promoCode} copied!`);
            setTimeout(() => setCopiedCode(false), 3000);
        } catch {
            toast.error('Failed to copy code.');
        }
    };

    const handleOpenWhatsApp = async () => {
        await sharePromoWithImage({
            code: promoCode,
            discountPercent,
            url: promoUrl,
            storeName: 'Drippy Banks',
            imagePath: '/promo-og.jpg',
        });
    };

    const handleDownloadImage = async () => {
        const success = await downloadPromoImage('/promo-og.jpg', `drippybanks-${promoCode}-promo.jpg`);
        if (success) {
            toast.success('Promo banner saved to your downloads!');
        } else {
            toast.error('Failed to download image.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg border-white/10 bg-slate-950/95 text-white p-6 sm:p-8 backdrop-blur-2xl rounded-3xl shadow-2xl">
                <DialogHeader className="text-left space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 w-fit">
                        <Sparkles size={13} /> Official WhatsApp Promo Link
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                        Share {discountPercent}% OFF Promo Link
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-sm">
                        Post this viral promo link to your WhatsApp Status with the promo banner! When friends click, they get an exclusive {discountPercent}% discount.
                    </DialogDescription>
                </DialogHeader>

                {/* Promo Preview Card */}
                <div className="my-3 space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video w-full">
                        <Image
                            src="/promo-og.jpg"
                            alt="Drippy Banks 10% OFF Promo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* WhatsApp Text Preview */}
                    <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/20 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                                <FaWhatsapp size={14} /> WhatsApp Status Caption
                            </span>
                            <button
                                onClick={handleCopyCode}
                                className="text-amber-300 hover:underline font-mono"
                            >
                                Code: {promoCode} {copiedCode && '✓'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line select-all bg-black/30 p-2.5 rounded-xl border border-white/5">
                            {caption}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Button
                        onClick={handleOpenWhatsApp}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-5 gap-2 shadow-md active:scale-95"
                    >
                        <FaWhatsapp size={18} />
                        <span>Share with Image</span>
                    </Button>

                    <Button
                        onClick={handleCopyCaption}
                        variant="secondary"
                        className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold py-5 gap-2"
                    >
                        {copiedCaption ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        <span>{copiedCaption ? 'Copied Caption!' : 'Copy Caption'}</span>
                    </Button>
                </div>

                <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400">
                    <button
                        onClick={handleDownloadImage}
                        className="inline-flex items-center gap-1.5 text-amber-300 hover:underline font-medium"
                    >
                        <Download size={13} /> Save Flyer Image
                    </button>
                    <a
                        href={promoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white hover:underline font-medium"
                    >
                        Preview Page <ExternalLink size={12} />
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
