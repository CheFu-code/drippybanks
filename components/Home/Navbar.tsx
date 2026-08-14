"use client";

import UserDropdown from "@/app/(public)/_components/Userdropdown";
import { useCart } from "@/context/CartContext";
import { useAuthUser } from "@/hooks/useAuthUser";
import { buildChefuLoginUrl, makeChefuReturnUrl } from "@/config/chefuAuth";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "../ui/button";

const NAV_ITEMS = [
    { label: "New Arrivals", href: "/shop" },
    { label: "Women", href: "/shop?q=women" },
    { label: "Men", href: "/shop?q=men" },
    { label: "Caps", href: "/shop?category=Caps" },
    { label: "Sale", href: "/shop?q=sale" },
];

export function Navbar() {
    const router = useRouter();
    const { user, loading } = useAuthUser();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const loginHref = typeof window !== "undefined"
        ? buildChefuLoginUrl(makeChefuReturnUrl("/", window.location.origin), window.location.origin)
        : "#";

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-slate-950/20">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-3 text-white"
                >
                    <Image
                        src={"/drippybanks.png"}
                        alt="Drippy Banks"
                        width={44}
                        height={44}
                        className="rounded-full"
                    />
                    <div className="text-left">
                        <span className="text-base font-semibold tracking-tight">Premium streetwear</span>
                    </div>
                </button>

                <div className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300 transition hover:text-white"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {loading ? (
                        <Loader className="h-5 w-5 text-amber-300 animate-spin" />
                    ) : user ? (
                        <UserDropdown user={user} />
                    ) : (
                        <a
                            href={loginHref}
                            className={buttonVariants({ size: "sm", variant: "default", className: "rounded-full px-4 py-2" })}
                        >
                            Login
                        </a>
                    )}

                    <Link
                        href="/cart"
                        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[10px] font-semibold text-slate-950">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-white/10 bg-slate-950/95 md:hidden"
                    >
                        <div className="space-y-1 px-4 py-3">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block rounded-2xl px-4 py-3 text-sm font-medium uppercase tracking-[0.15em] text-slate-300 transition hover:bg-white/5 hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
