'use client';

import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { useStoredProducts } from '@/hooks/useStoredProducts';

export function FeaturedProducts() {
    const { products } = useStoredProducts();

    const featured = products.filter((p) => p.featured && p.inStock !== false);
    const displayProducts = featured.length >= 4 
        ? featured.slice(0, 4) 
        : products.filter((p) => p.inStock !== false).slice(0, 4);

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Trending now</p>
                        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Premium pieces made to stand out.</h2>
                        <p className="mt-4 max-w-xl text-slate-400">
                            Discover the top-selling items for a flawless streetwear edit. Crafted with premium materials and elevated details.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-amber-100 transition hover:bg-amber-300/20"
                    >
                        View all products
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
