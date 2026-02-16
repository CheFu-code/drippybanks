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
            <Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
                {label}
            </Link>
        );
    }

    return (
        <a href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
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
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tighter">Drippy Banks</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Elevating your everyday style with premium quality and sustainable fashion. Designed for the modern individual.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-3">
                            {SHOP_LINKS.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Help</h4>
                        <ul className="space-y-3">
                            {HELP_LINKS.map((item) => (
                                <li key={item.label}>
                                    {renderFooterLink(resolveHelpHref(item, user?.id), item.label)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Sign up for our newsletter to get the latest news, announcements, and special offers.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-white text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </button>
                            {message && (
                                <p
                                    className={`text-xs ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                                        }`}
                                >
                                    {message.text}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="text-center md:text-left">
                        <p>&copy; {new Date().getFullYear()} DrippyBanks Inc. All rights reserved.</p>
                        <p className="mt-1 text-xs text-gray-400">
                            Crafted with care by the{' '}
                            <a
                                href="https://chefuinc.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline-offset-2 hover:underline text-gray-300 hover:text-white transition-colors"
                            >
                                CheFu Inc.
                            </a>
                            .
                        </p>
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
