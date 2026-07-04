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
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group overflow-hidden rounded-[1.75rem] border border-white/5 bg-slate-950/90 shadow-xl shadow-slate-950/30"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                <Image
                    fill
                    priority
                    src={image}
                    alt={name}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <button
                    type="button"
                    aria-label={`Add ${name} to cart`}
                    onClick={() => addToCart({ id, name, price, image, category })}
                    className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                    <Plus size={20} />
                </button>
                <span className="absolute left-4 top-4 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
                    {category}
                </span>
            </div>
            <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-amber-300">{name}</h3>
                <p className="text-sm text-slate-400">R{price.toFixed(2)}</p>
            </div>
        </motion.article>
    );
}
