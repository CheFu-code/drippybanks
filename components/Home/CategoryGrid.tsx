import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        id: 'women',
        name: 'Women',
        image:'/customerOne.jpeg',
        colSpan: 'md:col-span-1',
    },
    {
        id: 'men',
        name: 'Men',
        image:'/customerTwo.jpeg',
        colSpan: 'md:col-span-1',
    },
    {
        id: 'caps',
        name: 'Caps',
        image:'/cap.jpeg',
        colSpan: 'md:col-span-2',
    },
];

const categoryHrefById: Record<string, string> = {
    women: '/shop?category=All',
    men: '/shop?category=All',
    caps: '/shop?category=Caps',
};

export function CategoryGrid() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
                <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        className={`relative group overflow-hidden rounded-xl h-100 ${category.colSpan}`}
                    >
                        <Image
                            fill
                            priority={index === 0}
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                            <Link
                                href={categoryHrefById[category.id] ?? '/shop'}
                                className="inline-block border-b border-white pb-1 text-sm font-medium hover:text-gray-200 transition-colors"
                            >
                                Explore Collection
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
