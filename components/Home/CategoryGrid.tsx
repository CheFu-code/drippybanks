import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        id: 'women',
        name: 'Women',
        image: '/customerOne.jpeg',
        description: 'Soft silhouettes crafted for bold everyday wear',
    },
    {
        id: 'men',
        name: 'Men',
        image: '/customerTwo.jpeg',
        description: 'Modern fit and premium details for every look',
    },
    {
        id: 'caps',
        name: 'Caps',
        image: '/cap.jpeg',
        description: 'Street essential toppers for every outfit',
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
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={categoryHrefById[category.id] || '/shop'}
                        className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 transition hover:-translate-y-1 hover:border-amber-300/40 hover:bg-slate-900"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
                            <Image
                                fill
                                src={category.image}
                                alt={category.name}
                                className="object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                        </div>
                        <div className="space-y-3 p-6">
                            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">{category.name}</p>
                            <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                            <p className="text-sm leading-6 text-slate-400">{category.description}</p>
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-amber-300">
                                Explore
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
