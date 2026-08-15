'use client';

import { Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/context/CartContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useStoredProducts } from '@/hooks/useStoredProducts';
import { toast } from 'sonner';
import EmptyProduct from './_componets/ui/EmptyProduct';

const ShopPageContent = () => {
    const { addToCart } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { products } = useStoredProducts();

    // Size selection state per product card
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

    // Dynamic categories from catalog
    const allCategories = useMemo(() => {
        const set = new Set<string>(['All']);
        products.forEach((p) => {
            if (p.category) set.add(p.category);
        });
        return Array.from(set);
    }, [products]);

    const normalizeCategory = (value: string | null) =>
        allCategories.includes(value ?? '') ? (value as string) : 'All';

    const selectedCategory = normalizeCategory(searchParams.get('category'));
    const searchQuery = searchParams.get('q') ?? '';
    const isFromNavSearch = searchParams.get('source') === 'nav-search';
    const searchPlaceholder = isFromNavSearch
        ? 'Search for a product from the navbar...'
        : 'Search products by name or category...';

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value == null) {
                params.delete(key);
                return;
            }
            params.set(key, value);
        });

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
            normalizedQuery.length === 0 ||
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery) ||
            (product.badge && product.badge.toLowerCase().includes(normalizedQuery));
        return matchesCategory && matchesSearch;
    });

    const handleSelectSize = (productId: string, size: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.inStock === false) {
            toast.error('This piece is currently sold out.');
            return;
        }

        const sizeToUse = selectedSizes[product.id] || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
        addToCart(product, sizeToUse);
        toast.success(`Added "${product.name}"${sizeToUse ? ` (${sizeToUse})` : ''} to cart!`);
    };

    return (
        <div className="space-y-8">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mt-2">New Arrivals</h1>
                    <p className="text-slate-400 mt-1 text-sm">Discover the latest premium streetwear silhouettes & essentials.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) =>
                                updateParams({
                                    q: e.target.value.trim() ? e.target.value : null,
                                    source: null,
                                })
                            }
                            className="pl-10 pr-4 py-2.5 border border-white/10 rounded-2xl bg-slate-900/90 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent w-full md:w-72 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() =>
                            updateParams({
                                category: category === 'All' ? null : category,
                            })
                        }
                        className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${selectedCategory === category
                            ? 'bg-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-300/20'
                            : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-slate-800'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => {
                    const isSoldOut = product.inStock === false;
                    const availableSizes = product.sizes || ['One Size'];
                    const currentSize = selectedSizes[product.id] || availableSizes[0];

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/40 flex flex-col justify-between hover:border-amber-300/30 transition-all duration-300"
                        >
                            <div>
                                <div className="aspect-4/5 w-full overflow-hidden rounded-t-3xl relative bg-slate-950">
                                    <Image
                                        fill
                                        priority={index < 4}
                                        src={product.image}
                                        alt={product.name}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

                                    {/* Category Pill */}
                                    <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                                        {product.category}
                                    </span>

                                    {/* Badge */}
                                    {product.badge && (
                                        <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                            {product.badge}
                                        </span>
                                    )}

                                    {/* Sold Out / In Stock */}
                                    {isSoldOut && (
                                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                                            <span className="px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider">
                                                Sold Out
                                            </span>
                                        </div>
                                    )}

                                    {/* Add Button */}
                                    {!isSoldOut && (
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            aria-label={`Add ${product.name} to cart`}
                                            className="absolute bottom-3.5 right-3.5 cursor-pointer bg-amber-300 hover:bg-amber-200 p-3 rounded-full shadow-lg text-slate-950 transition-all duration-300 transform translate-y-0 hover:scale-105 flex items-center justify-center font-bold"
                                        >
                                            <Plus size={18} className="stroke-3" />
                                        </button>
                                    )}
                                </div>

                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="text-base text-white font-bold group-hover:text-amber-300 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-slate-400">{product.fit || product.category}</p>
                                    </div>

                                    {/* Sizes selector chips */}
                                    {availableSizes.length > 1 && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold uppercase text-slate-400">Size:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {availableSizes.map((sz) => (
                                                    <button
                                                        key={sz}
                                                        type="button"
                                                        onClick={(e) => handleSelectSize(product.id, sz, e)}
                                                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${currentSize === sz
                                                            ? 'bg-amber-300 text-slate-950 border-amber-300 font-extrabold shadow-sm'
                                                            : 'bg-slate-950 text-slate-300 border-white/10 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {sz}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price footer */}
                            <div className="px-5 pb-5 pt-2 flex items-baseline justify-between border-t border-white/5">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-base font-extrabold text-amber-300">
                                        R{product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-slate-400 line-through">
                                            R{product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                    {product.inStock !== false ? 'In stock' : 'Out of stock'}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <EmptyProduct router={router} searchParams={searchParams} pathname={pathname} />
            )}

        </div>
    );
};

const ShopPage = () => {
    return (
        <Suspense fallback={<div className="py-10 text-center text-slate-400">Loading shop...</div>}>
            <ShopPageContent />
        </Suspense>
    );
};

export default ShopPage;
