import UserDropdown from "@/app/(public)/_components/Userdropdown";
import { useAuthUser } from "@/hooks/useAuthUser";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();
    const { user, loading } = useAuthUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-accent-foreground backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-white hover:bg-gray-100/30"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Logo */}
                    <button
                        onClick={() => router.push("/")}
                        className="shrink-0 cursor-pointer flex items-center justify-center md:justify-start flex-1 md:flex-none"
                    >
                        <Image
                            src={"/drippybanks.png"}
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {["New Arrivals", "Women", "Men", "Caps", "Sale"].map(
                                (item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
                                    >
                                        {item}
                                    </a>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-white hover:bg-gray-100/30 transition-colors">
                            <Search size={20} />
                        </button>
                        {loading ? (
                            <Loader className="size-4 text-white animate-spin" />
                        ) : user ? (
                            <Link
                                href="/"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                <UserDropdown user={user} />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className={buttonVariants({ size: "sm", variant: "outline" })}
                            >
                                Login
                            </Link>
                        )}
                        <button className="p-2 text-white hover:bg-gray-100/30 transition-colors relative">
                            <ShoppingBag size={20} />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {["New Arrivals", "Women", "Men", "Caps", "Sale"].map(
                                (item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                    >
                                        {item}
                                    </a>
                                ),
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
