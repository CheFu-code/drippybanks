import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export function ProductCard({
    id,
    name,
    price,
    image,
    category,
}: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
        >
            <div className="relative overflow-hidden aspect-3/4 mb-4 bg-gray-100 rounded-lg">
                <Image
                    fill
                    priority
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <button
                    type="button"
                    aria-label={`Add ${name} to cart`}
                    onClick={() => addToCart({ id, name, price, image, category })}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
                >
                    <Plus size={20} />
                </button>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {category}
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {name}
                </h3>
                <p className="text-gray-500">${price.toFixed(2)}</p>
            </div>
        </motion.div>
    );
}
