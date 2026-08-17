import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useCart, type Product } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    originalPrice?: number;
    badge?: string;
    sizes?: string[];
    inStock?: boolean;
    fit?: string;
}

export function ProductCard(props: ProductCardProps) {
    const { id, name, price, image, category, originalPrice, badge, sizes, inStock, fit } = props;
    const { addToCart } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (inStock === false) {
            toast.error("This piece is currently sold out.");
            return;
        }
        const defaultSize = sizes && sizes.length > 0 ? sizes[0] : undefined;
        const productObj: Product = {
            id,
            name,
            price,
            image,
            category,
            originalPrice,
            badge,
            sizes,
            inStock,
            fit,
        };
        addToCart(productObj, defaultSize);
        toast.success(`Added "${name}" to cart!`);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-white/5 bg-slate-950/90 shadow-xl shadow-slate-950/30 flex flex-col justify-between"
        >
            <div className="relative aspect-4/5 overflow-hidden bg-slate-900">
                <Image
                    fill
                    priority
                    src={image}
                    alt={name}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                
                {inStock !== false && (
                    <button
                        type="button"
                        aria-label={`Add ${name} to cart`}
                        onClick={handleAdd}
                        className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 inline-flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 hover:bg-amber-200"
                    >
                        <Plus size={16} className="stroke-[3] sm:hidden" />
                        <Plus size={20} className="stroke-[3] hidden sm:block" />
                    </button>
                )}

                <span className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4 rounded-full bg-slate-950/75 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider sm:tracking-[0.28em] text-amber-300 border border-white/10">
                    {category}
                </span>

                {badge && (
                    <span className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 rounded-full bg-amber-400 text-slate-950 px-2 py-0.5 sm:px-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md">
                        {badge}
                    </span>
                )}
            </div>

            <div className="space-y-1 sm:space-y-2 p-3 sm:p-5">
                <div>
                    <h3 className="text-xs sm:text-lg font-semibold text-white transition-colors group-hover:text-amber-300 line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1">{fit || category}</p>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                    <p className="text-xs sm:text-base font-bold text-amber-300 font-mono">R{price.toFixed(2)}</p>
                    {originalPrice && (
                        <p className="text-[10px] sm:text-xs text-slate-500 line-through font-mono">R{originalPrice.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
