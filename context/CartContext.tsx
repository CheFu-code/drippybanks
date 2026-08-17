'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    originalPrice?: number;
    sizes?: string[];
    selectedSize?: string;
    colors?: string[];
    selectedColor?: string;
    badge?: string;
    description?: string;
    fit?: string;
    inStock?: boolean;
    stock?: number;
    featured?: boolean;
    createdAt?: string;
};

export type CartItem = Product & {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
    decreaseQuantity: (productId: string, selectedSize?: string, selectedColor?: string) => void;
    removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
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

    const matchesItem = (item: CartItem, productId: string, size?: string, color?: string) => {
        if (item.id !== productId) return false;
        if (size !== undefined && (item.selectedSize ?? '') !== size) {
            return false;
        }
        if (color !== undefined && (item.selectedColor ?? '') !== color) {
            return false;
        }
        return true;
    };

    const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
        const effectiveSize = selectedSize ?? product.selectedSize ?? (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
        const effectiveColor = selectedColor ?? product.selectedColor ?? (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

        setCart((prev) => {
            const existing = prev.find(
                (item) =>
                    item.id === product.id &&
                    (item.selectedSize ?? '') === (effectiveSize ?? '') &&
                    (item.selectedColor ?? '') === (effectiveColor ?? '')
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id &&
                    (item.selectedSize ?? '') === (effectiveSize ?? '') &&
                    (item.selectedColor ?? '') === (effectiveColor ?? '')
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    ...product,
                    selectedSize: effectiveSize,
                    selectedColor: effectiveColor,
                    quantity: 1,
                },
            ];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, size?: string, color?: string) => {
        setCart((prev) => prev.filter((item) => !matchesItem(item, productId, size, color)));
    };

    const decreaseQuantity = (productId: string, size?: string, color?: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    matchesItem(item, productId, size, color)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
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
