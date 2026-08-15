import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

const EmptyProduct = ({
    router,
    searchParams,
    pathname,
}: {
    router: AppRouterInstance;
    searchParams: ReadonlyURLSearchParams;
    pathname: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center justify-center py-32 px-8 overflow-hidden rounded-3xl border border-white/6 bg-linear-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-sm"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
            </div>

            {/* Animated icon ring */}
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30"
                    style={{ margin: "-10px" }}
                />
                <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
                    <Search className="w-6 h-6 text-slate-500" />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2 tracking-tight">
                No pieces found
            </h3>
            <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed">
                Nothing matches your current search or filters. Try broadening your
                search or clearing the filters.
            </p>

            {/* Clear filters CTA */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("q");
                    params.delete("category");
                    router.push(`${pathname}?${params.toString()}`);
                }}
                className="mt-8 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200"
            >
                Clear filters
            </motion.button>
        </motion.div>
    );
};

export default EmptyProduct;
