'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
};

export type CartItem = Product & {
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    decreaseQuantity: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const decreaseQuantity = (productId: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
