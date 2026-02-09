import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const categories = [
    {
        id: 'women',
        name: 'Women',
        image: 'https://images.unsplash.com/photo-1760551600460-018b52b28045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBtb2RlbCUyMHRyZW5keSUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDYzODg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        colSpan: 'md:col-span-1',
    },
    {
        id: 'men',
        name: 'Men',
        image: 'https://images.unsplash.com/photo-1619441523834-995b599b5baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwbW9kZWwlMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NzA2Mzg4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        colSpan: 'md:col-span-1',
    },
    {
        id: 'accessories',
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1746796623821-299efba84557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBzaG9lcyUyMGJhZyUyMGZsYXRsYXl8ZW58MXx8fHwxNzcwNjM4ODg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        colSpan: 'md:col-span-2',
    },
];

export function CategoryGrid() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`relative group overflow-hidden rounded-xl h-100 ${category.colSpan}`}
                    >
                        <Image
                            fill priority
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                            <a href="#" className="inline-block border-b border-white pb-1 text-sm font-medium hover:text-gray-200 transition-colors">
                                Explore Collection
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
