import React from 'react';
import { ArrowRight, Sparkles, Shirt, BadgePercent, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const categories = [
    {
        id: 'women',
        name: 'Women',
        label: 'Everyday luxe',
        description: 'Soft silhouettes, statement layers, and elevated essentials.',
        accent: 'from-amber-400/20 via-amber-300/10 to-transparent',
        icon: Shirt,
    },
    {
        id: 'men',
        name: 'Men',
        label: 'Street-ready fits',
        description: 'Bold textures and premium staples designed to move with you.',
        accent: 'from-cyan-400/20 via-sky-400/10 to-transparent',
        icon: Sparkles,
    },
    {
        id: 'caps',
        name: 'Caps',
        label: 'Finish the fit',
        description: 'Clean accessories that pull any look together instantly.',
        accent: 'from-fuchsia-400/20 via-pink-400/10 to-transparent',
        icon: ShoppingBag,
    },
];

const categoryHrefById: Record<string, string> = {
    women: '/shop?q=women',
    men: '/shop?q=men',
    caps: '/shop?category=Caps',
};

export function CategoryGrid() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Featured categories</p>
                    <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Discover your next signature look</h2>
                </div>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300 transition hover:text-white"
                >
                    View all
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <Link
                            key={category.id}
                            href={categoryHrefById[category.id] || '/shop'}
                            className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-slate-900"
                        >
                            <div className={`relative overflow-hidden border-b border-white/10 bg-gradient-to-br ${category.accent}`}>
                                <div className="flex min-h-[220px] items-center justify-between p-8">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{category.label}</p>
                                        <h3 className="mt-5 text-3xl font-semibold text-white">{category.name}</h3>
                                    </div>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 text-amber-300 shadow-lg shadow-amber-500/10">
                                        <Icon size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-6">
                                <p className="text-sm leading-6 text-slate-400">{category.description}</p>
                                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amber-300">
                                    Explore
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
