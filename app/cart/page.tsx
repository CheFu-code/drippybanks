'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, cartTotal, removeFromCart, clearCart } = useCart();

    return (
        <div className="min-h-screen p-5 bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-20 max-w-5xl mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl">Your Cart</CardTitle>
                        {cart.length > 0 && (
                            <Button variant="outline" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {cart.length === 0 ? (
                            <div className="py-10 text-center space-y-3">
                                <p className="text-muted-foreground">Your cart is empty.</p>
                                <Button asChild>
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-20 w-20 rounded-md overflow-hidden border bg-white">
                                            <Image
                                                fill
                                                src={item.image}
                                                alt={item.name}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-semibold">Total</p>
                                    <p className="text-lg font-semibold">${cartTotal.toFixed(2)}</p>
                                </div>
                                <Button className="w-full">Checkout</Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
