'use client'

import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const SHOP_LINKS = [
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Women', href: '/shop?q=women' },
    { label: 'Men', href: '/shop?q=men' },
    { label: 'Caps', href: '/shop?category=Caps' },
    { label: 'Sale', href: '/shop?q=sale' },
];

const HELP_LINKS = [
    { label: 'Customer Service', href: 'mailto:support@drippybanks.com' },
    { label: 'My Account', type: 'account' as const },
    { label: 'Find a Store', href: '/shop' },
    { label: 'Legal & Privacy', href: 'mailto:legal@drippybanks.com' },
    { label: 'Contact', href: 'mailto:hello@drippybanks.com' },
];

type HelpLink = (typeof HELP_LINKS)[number];

const resolveHelpHref = (item: HelpLink, userId?: string) => {
    if ('type' in item && item.type === 'account') {
        return userId ? `/${userId}/profile` : '/login';
    }
    return item.href;
};

const renderFooterLink = (href: string, label: string) => {
    if (href.startsWith('/')) {
        return (
            <Link href={href} className="text-slate-300 hover:text-white transition-colors text-sm">
                {label}
            </Link>
        );
    }

    return (
        <a href={href} className="text-slate-300 hover:text-white transition-colors text-sm">
            {label}
        </a>
    );
};

export function Footer() {
    const { user } = useAuthUser();
    const [email, setEmail] = useState('');
    const { isSubmitting, message, submit } = useNewsletterSubscription();

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const subscribed = await submit(email, 'footer');
        if (subscribed) {
            setEmail('');
        }
    };

    return (
        <footer className="bg-slate-950 text-slate-100 pt-16 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 mb-14">
                    <div className="space-y-4">
                        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Drippy Banks</p>
                        <h3 className="text-2xl font-semibold text-white">Premium streetwear with a modern edge.</h3>
                        <p className="text-sm leading-7 text-slate-400">
                            Built for bold style, crafted for lasting wear, and designed to feel luxurious from every angle.
                        </p>
                        <div className="flex items-center gap-3 text-slate-400">
                            <a href="#" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-amber-300/30 hover:bg-amber-400/10">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-amber-300/30 hover:bg-amber-400/10">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-amber-300/30 hover:bg-amber-400/10">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-amber-300/30 hover:bg-amber-400/10">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Shop</h4>
                        <ul className="space-y-3">
                            {SHOP_LINKS.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-slate-300 hover:text-white text-sm transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
                        <ul className="space-y-3">
                            {HELP_LINKS.map((item) => (
                                <li key={item.label}>
                                    {renderFooterLink(resolveHelpHref(item, user?.id), item.label)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Stay updated</h4>
                        <p className="text-sm leading-7 text-slate-400 mb-5">
                            Subscribe for release alerts, exclusive offers, and early access to new drops.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        {message && (
                            <p className={`mt-3 text-xs ${message.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                    <p>&copy; {new Date().getFullYear()} DrippyBanks Inc. All rights reserved.</p>
                    <p>
                        Crafted with precision by{' '}
                        <a
                            href="https://chefuinc.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-300 hover:text-amber-200"
                        >
                            CheFu Inc.
                        </a>
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-slate-400 hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
