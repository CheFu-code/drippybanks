'use client'

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS } from './products';

const CATEGORIES = ['All', 'Tops', 'Caps', 'Bags', 'Hoodies'];

const ShopPage = () => {
    const { addToCart } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const normalizeCategory = (value: string | null) =>
        CATEGORIES.includes(value ?? '') ? (value as string) : 'All';

    const selectedCategory = normalizeCategory(searchParams.get('category'));
    const searchQuery = searchParams.get('q') ?? '';
    const isFromNavSearch = searchParams.get('source') === 'nav-search';
    const searchPlaceholder = isFromNavSearch
        ? 'Search for a product from the navbar...'
        : 'Search products...';

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
                return;
            }
            params.set(key, value);
        });

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const filteredProducts = PRODUCTS.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
            normalizedQuery.length === 0 ||
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Arrivals</h1>
                    <p className="text-gray-500 mt-1">Check out the latest trends for this season.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() =>
                            updateParams({
                                category: category === 'All' ? null : category,
                            })
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group border border-gray-500/70 rounded-xl overflow-hidden shadow-lg"
                    >
                        <div className="aspect-3/4 w-full overflow-hidden rounded-lg relative">
                            <Image
                                fill priority
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                onClick={() => addToCart(product)}
                                className="absolute bottom-4 right-4 cursor-pointer bg-white p-3 rounded-full shadow-lg text-black opacity-100 md:opacity-0 transform translate-y-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">+ Add</span>
                                </div>
                            </button>
                        </div>
                        <div className="mt-4 flex justify-between px-2 pb-2">
                            <div>
                                <h3 className="text-sm text-gray-700 font-medium">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No products found.</p>
                </div>
            )}
        </div>
    );
};

export default ShopPage;
