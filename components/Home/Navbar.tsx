import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';


export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-800 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
                        <Image src={'/drippybanks.png'} alt='Logo' width={100} height={100} />
                    </div>


                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Search size={20} />
                        </button>
                        <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <User size={20} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
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
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}