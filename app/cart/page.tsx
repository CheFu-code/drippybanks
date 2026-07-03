'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function CartPage() {
    const router = useRouter();
    const { user } = useAuthUser();
    const { cart, cartTotal, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
    const handleCheckout = () => {
        if (!user) {
            router.push('/login?next=/checkout');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen p-5 bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />
            <main className="pt-24 max-w-5xl mx-auto">
                <Card className="bg-slate-900/80 border-white/10">
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
                                <p className="text-slate-400">Your cart is empty.</p>
                                <Button asChild>
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="relative h-20 w-20 rounded-md overflow-hidden border border-white/10 bg-slate-900">
                                            <Image
                                                fill
                                                src={item.image}
                                                alt={item.name}
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-slate-400">{item.category}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                >
                                                    -
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => addToCart(item)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
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
                                    <p className="text-lg font-semibold">R{cartTotal.toFixed(2)}</p>
                                </div>
                                <Button className="w-full" onClick={handleCheckout}>
                                    Checkout
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
