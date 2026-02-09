import React from 'react';
import { ProductCard } from './ProductCard';

const products = [
    {
        id: '1',
        name: 'Classic White Tee',
        price: 29.00,
        category: 'Essentials',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnQlMjBoYW5nZXIlMjBtaW5pbWFsfGVufDF8fHx8MTc3MDYzODg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
        id: '2',
        name: 'Summer Floral Dress',
        price: 89.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMHdvbWFuJTIwZmxvcmFsfGVufDF8fHx8MTc3MDYzODg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
        id: '3',
        name: 'Vintage Denim Jacket',
        price: 120.00,
        category: 'Unisex',
        image: 'https://images.unsplash.com/photo-1580644228275-2b826dbec5bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMGJsdWUlMjBqZWFucyUyMGZhc2hpb258ZW58MXx8fHwxNzcwNjM4ODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
        id: '4',
        name: 'Urban Streetwear Set',
        price: 150.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1619441523834-995b599b5baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwbW9kZWwlMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NzA2Mzg4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
];

export function FeaturedProducts() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50/50 rounded-3xl my-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Trending Now</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Our most popular pieces, curated just for you. Get them before they&apos;re gone.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>

            <div className="mt-12 text-center">
                <button className="px-8 py-3 border border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors">
                    View All Products
                </button>
            </div>
        </section>
    );
}
