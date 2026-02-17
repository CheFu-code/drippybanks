import { ProductCard } from './ProductCard';
import Link from 'next/link';

const products = [
    {
        id: '1',
        name: 'Classic White Tee',
        price: 300.00,
        category: 'Essentials',
        image:'/blindManWhite.jpeg'
    },
    {
        id: '2',
        name: 'Women Classic Tee',
        price: 300.00,
        category: 'Women',
        image:'/customerFive.jpeg'
    },
    {
        id: '3',
        name: 'Urban Skeleton Claw Graphic T-Shirt',
        price: 300.00,
        category: 'Unisex',
        image:'/customerThree.jpeg'
    },
    {
        id: '4',
        name: 'Urban Streetwear Set',
        price: 300.00,
        category: 'Men',
        image:'/customerFour.jpeg',
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
                <Link
                    href="/shop"
                    className="inline-block px-8 py-3 border border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                    View All Products
                </Link>
            </div>
        </section>
    );
}
