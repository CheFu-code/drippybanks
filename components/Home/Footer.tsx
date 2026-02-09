import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold tracking-tighter">Drippy Banks</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Elevating your everyday style with premium quality and sustainable fashion. Designed for the modern individual.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-3">
                            {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Help</h4>
                        <ul className="space-y-3">
                            {['Customer Service', 'My Account', 'Find a Store', 'Legal & Privacy', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Sign up for our newsletter to get the latest news, announcements, and special offers.
                        </p>
                        <form className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                            />
                            <button className="bg-white text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} DrippyBanks Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
