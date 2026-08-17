'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    Share2, 
    Sparkles, 
    Clock, 
    Flame, 
    ShoppingBag, 
    Tag, 
    ArrowRight, 
    ExternalLink,
    ShieldCheck,
    Truck,
    Percent,
    Download
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'sonner';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer';
import { Button } from '@/components/ui/button';
import { useCart, Product } from '@/context/CartContext';
import { PRODUCTS } from '@/app/shop/products';
import { loadStoredProducts } from '@/lib/product-store';
import { 
    DEFAULT_PROMO_CODE, 
    resolvePromoDiscount, 
    saveStoredPromoCode, 
    generateWhatsAppPromoCaption, 
    getWhatsAppShareUrl,
    sharePromoWithImage,
    downloadPromoImage,
    KNOWN_PROMO_CAMPAIGNS
} from '@/lib/promo';

interface PromoLandingContentProps {
    initialCode?: string;
}

export function PromoLandingContent({ initialCode = DEFAULT_PROMO_CODE }: PromoLandingContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart, setIsCartOpen } = useCart();

    const paramCode = searchParams.get('code') || initialCode;
    const [promoCode, setPromoCode] = useState(paramCode.toUpperCase().trim());
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

    const discountPercent = useMemo(() => resolvePromoDiscount(promoCode), [promoCode]);
    const campaign = KNOWN_PROMO_CAMPAIGNS[promoCode];

    // Urgency countdown timer (persisted or realistic remaining hours)
    const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 5, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-save promo into storage when arriving on promo page
    useEffect(() => {
        if (promoCode) {
            saveStoredPromoCode(promoCode, discountPercent);
            setIsClaimed(true);
        }
    }, [promoCode, discountPercent]);

    // Load available products for showcase
    const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
    useEffect(() => {
        const stored = loadStoredProducts();
        if (stored && stored.length > 0) {
            setCatalogProducts(stored);
        }
    }, []);

    const promoProducts = useMemo(() => {
        return catalogProducts.slice(0, 8);
    }, [catalogProducts]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(promoCode);
            setCopiedCode(true);
            saveStoredPromoCode(promoCode, discountPercent);
            setIsClaimed(true);
            toast.success(`Coupon code "${promoCode}" copied to clipboard!`);
            setTimeout(() => setCopiedCode(false), 3000);
        } catch {
            toast.error('Failed to copy code.');
        }
    };

   

    const handleCopyLink = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drippybanks.chefuinc.com';
        const url = `${origin}/promo?code=${promoCode}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopiedLink(true);
            toast.success('Promo link copied to clipboard!');
            setTimeout(() => setCopiedLink(false), 3000);
        } catch {
            toast.error('Failed to copy link.');
        }
    };

    const handleOpenWhatsApp = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drippybanks.chefuinc.com';
        const url = `${origin}/promo?code=${promoCode}`;
        await sharePromoWithImage({
            code: promoCode,
            discountPercent,
            url,
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

    const handleClaimAndShop = () => {
        saveStoredPromoCode(promoCode, discountPercent);
        setIsClaimed(true);
        toast.success(`${discountPercent}% OFF coupon applied! Start shopping now.`);
        const productsElement = document.getElementById('promo-deals');
        if (productsElement) {
            productsElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/shop');
        }
    };

    const handleAddToCartWithPromo = (product: Product) => {
        saveStoredPromoCode(promoCode, discountPercent);
        setIsClaimed(true);
        const selectedSize = selectedSizes[product.id] || product.sizes?.[0] || 'M';
        addToCart(product, selectedSize);
        toast.success(`Added ${product.name} to cart with ${discountPercent}% OFF coupon!`);
    };

    const formatPrice = (price: number) => `R ${price.toFixed(2)}`;
    const calcDiscountPrice = (price: number) => {
        const discounted = price * (1 - discountPercent / 100);
        return Number(discounted.toFixed(2));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* ── Top Countdown Urgency Ticker ── */}
                <div className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 py-2.5 px-4 font-semibold text-center text-xs sm:text-sm tracking-wide shadow-md">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                       
                        <span>Final hours to grab savings! <strong>{discountPercent}% OFF coupon</strong> for new users only.</span>
                        <div className="flex items-center gap-1 font-mono font-bold bg-slate-950/20 px-2.5 py-0.5 rounded-md text-slate-950">
                            <Clock size={14} />
                            <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                        </div>
                    </div>
                </div>

                {/* ── Hero Promo Section ── */}
                <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Background glow ambient elements */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-amber-400/15 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute -top-20 right-10 w-87.5 h-87.5 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
                        
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">{discountPercent}% OFF</span> Coupon For New Users Only
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            Super affordable streetwear! Grab elevated hoodies, graphic tees, and luxury accessories before promo codes expire.
                        </p>
                    </div>

                    {/* ── Golden Voucher Coupon Ticket ── */}
                    <div className="max-w-2xl mx-auto">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative rounded-[2.5rem] p-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-2xl shadow-amber-500/20"
                        >
                            <div className="rounded-[2.4rem] bg-slate-900/95 backdrop-blur-2xl p-6 sm:p-10 border border-white/10 text-center relative overflow-hidden">
                                <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />
                                
                                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/drippybanks.png"
                                            alt="Drippy Banks Logo"
                                            width={44}
                                            height={44}
                                            className="rounded-full ring-2 ring-amber-400/40"
                                        />
                                        <div className="text-left">
                                            <h3 className="font-bold text-white tracking-tight">Drippy Banks</h3>
                                            <p className="text-xs text-amber-300 font-medium">Official VIP Coupon Voucher</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider">
                                        {campaign?.badge || `💰 ${discountPercent}% OFF`}
                                    </span>
                                </div>

                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
                                    Your Exclusive Coupon Code
                                </p>

                                {/* Code Display Box */}
                                <div className="relative my-4 flex items-center justify-between rounded-2xl border-2 border-dashed border-amber-400/60 bg-amber-400/5 p-4 sm:p-5">
                                    <div className="text-left">
                                        <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-amber-300">
                                            {promoCode}
                                        </span>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Instant {discountPercent}% discount applied at checkout
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleCopyCode}
                                        size="lg"
                                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
                                    >
                                        {copiedCode ? (
                                            <>
                                                <Check size={18} className="text-emerald-950" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Claim & Shop Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                    <Button
                                        onClick={handleClaimAndShop}
                                        size="lg"
                                        className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold py-6 text-base shadow-xl shadow-amber-500/25"
                                    >
                                        <ShoppingBag size={18} className="mr-2" />
                                        <span>Claim & Shop Deals</span>
                                    </Button>

                                    <Button
                                        onClick={handleOpenWhatsApp}
                                        variant="outline"
                                        size="lg"
                                        className="w-full rounded-2xl border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 font-bold py-6 text-base"
                                    >
                                        <FaWhatsapp size={20} className="mr-2 text-emerald-400" />
                                        <span>Share on WhatsApp</span>
                                    </Button>
                                </div>

                                {isClaimed && (
                                    <p className="mt-4 text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                                        <Check size={14} className="text-emerald-400" /> Code <strong>{promoCode}</strong> is activated for your session!
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

               

                {/* ── 3-Step How It Works Section ── */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <h2 className="text-center text-xs uppercase tracking-[0.35em] text-amber-300 font-bold mb-3">
                        Quick & Simple
                    </h2>
                    <h3 className="text-center text-3xl font-bold text-white mb-10">
                        How To Redeem Your {discountPercent}% OFF
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center relative hover:border-amber-400/30 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-xl font-black mb-5">
                                1
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Claim Your Code</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Click &quot;Copy Code&quot; or claim the <span className="font-mono text-amber-300 font-semibold">{promoCode}</span> voucher on this page.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center relative hover:border-amber-400/30 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-xl font-black mb-5">
                                2
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Select Your Fits</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Browse our high-end graphic tees, hoodies, caps, and bags, then add your sizes to cart.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center relative hover:border-amber-400/30 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-xl font-black mb-5">
                                3
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Automatic {discountPercent}% OFF</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Head to checkout! Your {discountPercent}% discount is automatically applied to your order subtotal.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Curated Promo Streetwear Deals Catalog ── */}
                <section id="promo-deals" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300 font-bold mb-2">
                                <Percent size={14} /> Flash Deals Catalog
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                Streetwear Deals with {discountPercent}% OFF
                            </h2>
                        </div>

                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors"
                        >
                            View Entire Catalog <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {promoProducts.map((product) => {
                            const discPrice = calcDiscountPrice(product.price);
                            const savings = product.price - discPrice;
                            const isCapOrBag = product.category === 'Caps' || product.category === 'Bags';
                            const availableSizes = product.sizes && product.sizes.length > 0 
                                ? product.sizes 
                                : (isCapOrBag ? ['One Size'] : ['S', 'M', 'L', 'XL']);
                            const selectedSize = selectedSizes[product.id] || availableSizes[0];

                            return (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -4 }}
                                    className="group rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/90 overflow-hidden flex flex-col justify-between shadow-xl transition-all hover:border-amber-400/40"
                                >
                                    <div className="relative aspect-4/5 bg-slate-950 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                        
                                        {/* Promo Discount Tag */}
                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-black text-slate-950 uppercase shadow-lg">
                                            {discountPercent}% OFF
                                        </div>

                                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-slate-950/80 border border-white/20 px-2 py-0.5 sm:px-2.5 text-[9px] sm:text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                                            {product.category}
                                        </div>

                                        {/* Savings badge */}
                                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-xs font-bold text-emerald-300 backdrop-blur-md">
                                            Save R {savings.toFixed(0)}
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-bold text-white text-xs sm:text-base leading-snug line-clamp-1 mb-1 sm:mb-2">
                                                {product.name}
                                            </h3>

                                            {/* Price comparison */}
                                            <div className="flex items-baseline gap-1.5 sm:gap-2.5 mb-2 sm:mb-4">
                                                <span className="text-sm sm:text-2xl font-black text-amber-300 font-mono">
                                                    {formatPrice(discPrice)}
                                                </span>
                                                <span className="text-[10px] sm:text-sm text-slate-500 line-through font-mono">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>

                                            {/* Size Selector */}
                                            {availableSizes.length > 1 && (
                                                <div className="flex items-center gap-1 sm:gap-1.5 mb-3 sm:mb-4 flex-wrap">
                                                    <span className="text-[9px] sm:text-[11px] text-slate-400 uppercase font-semibold mr-0.5">Size:</span>
                                                    {availableSizes.map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                                                            className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[9px] sm:text-xs font-bold transition-colors ${
                                                                selectedSize === size
                                                                    ? 'bg-amber-400 text-slate-950'
                                                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                                                            }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => handleAddToCartWithPromo(product)}
                                            className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 sm:py-5 text-xs sm:text-sm gap-1.5 transition-all shadow-md active:scale-95"
                                        >
                                            <ShoppingBag size={14} className="sm:h-4 sm:w-4" /> 
                                            <span>Add to Cart</span>
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-6 text-base border border-white/10"
                        >
                            <Link href="/shop">
                                Explore All Products with {promoCode} Promo <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* ── Trust & Delivery Perks ── */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 mb-3">
                                <Truck size={22} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Nationwide Delivery</h4>
                            <p className="text-xs text-slate-400 mt-1">Fast & reliable delivery across South Africa or easy collection.</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 mb-3">
                                <ShieldCheck size={22} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Secure PayFast Payments</h4>
                            <p className="text-xs text-slate-400 mt-1">Pay safely with Instant EFT, Card, Masterpass, and QR payments.</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300 mb-3">
                                <Tag size={22} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Guaranteed Promo Savings</h4>
                            <p className="text-xs text-slate-400 mt-1">100% verified discount applied directly at checkout.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
