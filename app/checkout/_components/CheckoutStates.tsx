import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavedOrder } from './types';

export function LoadingCheckoutCard() {
    return (
        <Card className="border-gray-200 bg-linear-to-b from-white to-gray-50/70">
            <CardContent className="py-10">
                <div className="mx-auto max-w-md text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-semibold text-gray-900">Preparing checkout</p>
                        <p className="text-sm text-muted-foreground">Loading your saved address and payment options...</p>
                    </div>
                    <div className="mx-auto max-w-xs space-y-2 pt-2">
                        <div className="h-2 rounded bg-gray-200/80 animate-pulse" />
                        <div className="h-2 w-4/5 mx-auto rounded bg-gray-200/70 animate-pulse" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function EmptyCartCheckoutCard() {
    return (
        <Card className="border-gray-200 bg-linear-to-b from-white to-gray-50/70">
            <CardContent className="py-12">
                <div className="mx-auto max-w-md text-center space-y-5">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border bg-white shadow-sm">
                        <ShoppingBag className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-semibold text-gray-900">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground">
                            Add a few items you love and come back to complete your order.
                        </p>
                    </div>
                    <Button size="lg" className="min-w-52" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function OrderConfirmationCard({ placedOrder }: { placedOrder: SavedOrder }) {
    const router = useRouter();
    const shippingLabel = placedOrder.shipping === 0 ? 'Free' : `R${placedOrder.shipping.toFixed(2)}`;
    const taxLabel = placedOrder.tax === 0 ? 'Free' : `R${placedOrder.tax.toFixed(2)}`;

    return (
        <Card className="border-gray-200">
            <CardHeader>
                <CardTitle className="text-2xl">Order confirmed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Your order <span className="font-semibold">{placedOrder.id}</span> has been placed.
                </p>
                <p className="text-sm text-muted-foreground">
                    We&apos;ve sent confirmation to {placedOrder.customer.email}.
                </p>
                <div className="rounded-lg bg-gray-50 border p-4 text-sm space-y-1">
                    <p>Subtotal: R{placedOrder.subtotal.toFixed(2)}</p>
                    <p>Shipping: {shippingLabel}</p>
                    <p>Tax: {taxLabel}</p>
                    <p className="font-semibold">Total: R{placedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/cart')}>
                        Back to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
