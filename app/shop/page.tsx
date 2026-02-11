'use client'

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Product, useCart } from '@/context/CartContext';

// Mock Data
const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Classic White Tee',
        price: 29.00,
        category: 'Tops',
        image: "/blindManWhite.jpeg"
    },
    {
        id: '2',
        name: 'Vintage Denim Jeans',
        price: 9.45,
        category: 'Caps',
        image: '/cap.jpeg'
    },
    {
        id: '15',
        name: 'Vintage Denim Jeans',
        price: 9.45,
        category: 'Caps',
        image: '/cap2.png'
    },
    {
        id: '14',
        name: 'Vintage Denim Jeans',
        price: 9.45,
        category: 'Caps',
        image: '/cap3.png'
    },
    {
        id: '3',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/cropTop.jpeg'
    },
    {
        id: '6',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/dogGreen.jpeg'
    },
    {
        id: '10',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/skeleton.jpeg'
    },
    {
        id: '11',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/dogGreenYellow.jpeg'
    },
    {
        id: '12',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/normal.jpeg'
    },
    {
        id: '13',
        name: 'Vintage Denim Jeans',
        price: 89.00,
        category: 'Tops',
        image: '/greenBack.jpeg'
    },

    {
        id: '4',
        name: 'Summer Floral',
        price: 79.00,
        category: 'Hoodies',
        image: '/hoodieBlack.jpeg'
    },
    {
        id: '7',
        name: 'Summer Floral Dress',
        price: 79.00,
        category: 'Hoodies',
        image: '/hoodieBlue.jpeg'
    },
    {
        id: '8',
        name: 'Summer Floral Dress',
        price: 79.00,
        category: 'Hoodies',
        image: '/hoodieRed.jpeg'
    },
    {
        id: '9',
        name: 'Summer Floral Dress',
        price: 79.00,
        category: 'Hoodies',
        image: '/hoodieWhite.jpeg'
    },
    {
        id: '5',
        name: 'Essential Black Hoodie',
        price: 55.00,
        category: 'Bags',
        image: '/bag.jpeg'
    },

];

const CATEGORIES = ['All', 'Tops', 'Caps', 'Bags', 'Hoodies'];

const ShopPage = () => {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = PRODUCTS.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
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

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        onClick={() => setSelectedCategory(category)}
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
                                className="absolute bottom-4 right-4 cursor-pointer bg-white p-3 rounded-full shadow-lg text-black opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
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