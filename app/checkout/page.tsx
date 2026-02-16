'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { db } from '@/config/firebaseConfig';
import { useCart } from '@/context/CartContext';
import { useAuthUser } from '@/hooks/useAuthUser';
import { AppUser } from '@/types/user';

type CheckoutForm = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvc: string;
};

type SavedPaymentMethod = NonNullable<AppUser['paymentMethods']>[number];

type SavedOrder = {
    id: string;
    date: string;
    status: 'Processing';
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    paymentMethod: 'card' | 'cash';
    paymentMethodId?: string;
    items: Array<{ id: string; name: string; quantity: number; price: number; image: string }>;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        paymentMethod: 'card' | 'cash';
    };
};

const ORDER_STORAGE_KEY = 'drippybanks.orders';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: userLoading } = useAuthUser();
    const { cart, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<SavedOrder | null>(null);
    const [form, setForm] = useState<CheckoutForm>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvc: '',
    });
    const [selectedSavedCardId, setSelectedSavedCardId] = useState('');
    const [useSavedAddressOverride, setUseSavedAddressOverride] = useState<boolean | null>(null);
    const [paymentChoiceOverride, setPaymentChoiceOverride] = useState<'saved' | 'new' | 'cash' | null>(null);

    const savedCards = useMemo<SavedPaymentMethod[]>(
        () => (user?.paymentMethods ?? []).filter((method) => method.type === 'card'),
        [user?.paymentMethods],
    );
    const defaultSavedCard = useMemo(
        () => savedCards.find((method) => method.isDefault) ?? savedCards[0] ?? null,
        [savedCards],
    );
    const hasSavedAddress = Boolean(
        user?.addressStreet && user?.addressCity && user?.addressPostalCode && user?.country?.name,
    );
    const effectiveUseSavedAddress = useSavedAddressOverride ?? hasSavedAddress;
    const effectivePaymentChoice = paymentChoiceOverride ?? (savedCards.length > 0 ? 'saved' : 'new');
    const effectiveSelectedSavedCardId = selectedSavedCardId || defaultSavedCard?.id || '';

    const shipping = useMemo(() => 0, []);
    const tax = useMemo(() => 0, []);
    const grandTotal = useMemo(() => cartTotal + shipping + tax, [cartTotal, shipping, tax]);

    const onFormFieldChange = (field: keyof CheckoutForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validateCheckout = () => {
        const fullName = form.fullName.trim() || user?.fullname?.trim() || '';
        const email = form.email.trim() || user?.email?.trim() || '';
        const phone = form.phone.trim() || user?.phone?.trim() || '';

        if (!fullName) return 'Full name is required.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
        if (!phone) return 'Phone number is required.';

        if (!effectiveUseSavedAddress) {
            if (!form.address.trim()) return 'Address is required.';
            if (!form.city.trim()) return 'City is required.';
            if (!form.postalCode.trim()) return 'Postal code is required.';
            if (!form.country.trim()) return 'Country is required.';
        }

        if (effectivePaymentChoice === 'saved' && !effectiveSelectedSavedCardId) {
            return 'Please select a saved card.';
        }

        if (effectivePaymentChoice === 'new') {
            if (!/^\d{12,19}$/.test(form.cardNumber.replace(/\s/g, ''))) return 'Enter a valid card number.';
            if (!form.cardName.trim()) return 'Cardholder name is required.';
            if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) return 'Use card expiry format MM/YY.';
            if (!/^\d{3,4}$/.test(form.cardCvc)) return 'Enter a valid CVC.';
        }

        return null;
    };

    const handlePlaceOrder = async (event: FormEvent) => {
        event.preventDefault();

        if (cart.length === 0) {
            toast.error('Your cart is empty.');
            router.push('/shop');
            return;
        }

        const validationError = validateCheckout();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 900));

        const finalAddress = effectiveUseSavedAddress && hasSavedAddress
            ? {
                address: user?.addressStreet ?? '',
                city: user?.addressCity ?? '',
                postalCode: user?.addressPostalCode ?? '',
                country: user?.country?.name ?? '',
            }
            : {
                address: form.address,
                city: form.city,
                postalCode: form.postalCode,
                country: form.country,
            };

        const finalPaymentMethod = effectivePaymentChoice === 'cash' ? 'cash' : 'card';
        const fullName = form.fullName.trim() || user?.fullname?.trim() || '';
        const email = form.email.trim() || user?.email?.trim() || '';
        const phone = form.phone.trim() || user?.phone?.trim() || '';

        if (finalPaymentMethod === 'card') {
            setIsSubmitting(false);
            toast.info('Card payment is coming soon. Please use Cash on Delivery for now.');
            return;
        }

        const order: SavedOrder = {
            id: `ORD-${Date.now().toString().slice(-8)}`,
            date: new Date().toISOString(),
            status: 'Processing',
            total: Number(grandTotal.toFixed(2)),
            subtotal: Number(cartTotal.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            paymentMethod: finalPaymentMethod,
            paymentMethodId: effectivePaymentChoice === 'saved' ? effectiveSelectedSavedCardId : undefined,
            items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
            })),
            customer: {
                fullName,
                email,
                phone,
                address: finalAddress.address,
                city: finalAddress.city,
                postalCode: finalAddress.postalCode,
                country: finalAddress.country,
                paymentMethod: finalPaymentMethod,
            },
        };

        try {
            const { paymentMethodId, ...orderWithoutPaymentMethodId } = order;
            const firestoreOrder = {
                ...orderWithoutPaymentMethodId,
                ...(paymentMethodId ? { paymentMethodId } : {}),
                userId: user?.id ?? null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'drippy-banks-orders', order.id), {
                ...firestoreOrder,
            });

            const existingOrdersRaw = localStorage.getItem(ORDER_STORAGE_KEY);
            let existingOrders: SavedOrder[] = [];
            if (existingOrdersRaw) {
                try {
                    existingOrders = JSON.parse(existingOrdersRaw) as SavedOrder[];
                } catch {
                    existingOrders = [];
                }
            }
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, ...existingOrders]));

            clearCart();
            setPlacedOrder(order);
            toast.success(`Order ${order.id} placed successfully.`);
        } catch (error) {
            console.error('Failed to place order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="max-w-6xl mx-auto px-5 pb-12 pt-24">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Secure checkout</p>
                    <h1 className="text-3xl font-semibold mt-2">Complete your order</h1>
                </div>

                {userLoading ? (
                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">Loading checkout details...</p>
                        </CardContent>
                    </Card>
                ) : placedOrder ? (
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
                                <p>Subtotal: ${placedOrder.subtotal.toFixed(2)}</p>
                                <p>Shipping: Free</p>
                                <p>Tax: Free</p>
                                <p className="font-semibold">Total: ${placedOrder.total.toFixed(2)}</p>
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
                ) : cart.length === 0 ? (
                    <Card className="border-gray-200">
                        <CardContent className="space-y-4 pt-6">
                            <p className="text-muted-foreground">Your cart is empty.</p>
                            <Button asChild>
                                <Link href="/shop">Continue Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <form className="grid gap-6 lg:grid-cols-[1.45fr_1fr]" onSubmit={handlePlaceOrder}>
                        <div className="space-y-6">
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="fullName">Full name</Label>
                                        <Input
                                            id="fullName"
                                            value={form.fullName || user?.fullname || ''}
                                            onChange={(e) => onFormFieldChange('fullName', e.target.value)}
                                            placeholder="Jane Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.email || user?.email || ''}
                                            onChange={(e) => onFormFieldChange('email', e.target.value)}
                                            placeholder="jane@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={form.phone || user?.phone || ''}
                                            onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                            placeholder="+1 555 000 0000"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-xl">Shipping address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {hasSavedAddress && effectiveUseSavedAddress ? (
                                        <div className="rounded-lg border bg-gray-50 p-4">
                                            <p className="text-sm font-medium">Using your saved address</p>
                                            <p className="text-sm text-muted-foreground mt-2">{user?.addressStreet}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.addressCity} {user?.addressPostalCode}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{user?.country?.name}</p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setUseSavedAddressOverride(false)}
                                                >
                                                    Use Different Address
                                                </Button>
                                                {user?.id && (
                                                    <Button type="button" variant="ghost" asChild>
                                                        <Link href={`/${user.id}/profile`}>Manage in Profile</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address">Street address</Label>
                                                <Input
                                                    id="address"
                                                    value={form.address}
                                                    onChange={(e) => onFormFieldChange('address', e.target.value)}
                                                    placeholder="123 Main Street"
                                                    required={!effectiveUseSavedAddress}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={form.city}
                                                    onChange={(e) => onFormFieldChange('city', e.target.value)}
                                                    placeholder="Los Angeles"
                                                    required={!effectiveUseSavedAddress}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postalCode">Postal code</Label>
                                                <Input
                                                    id="postalCode"
                                                    value={form.postalCode}
                                                    onChange={(e) => onFormFieldChange('postalCode', e.target.value)}
                                                    placeholder="90001"
                                                    required={!effectiveUseSavedAddress}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    id="country"
                                                    value={form.country}
                                                    onChange={(e) => onFormFieldChange('country', e.target.value)}
                                                    placeholder="United States"
                                                    required={!effectiveUseSavedAddress}
                                                />
                                            </div>
                                            {hasSavedAddress && (
                                                <Button type="button" variant="outline" onClick={() => setUseSavedAddressOverride(true)}>
                                                    Use Saved Address
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    {!hasSavedAddress && user?.id && (
                                        <p className="text-xs text-muted-foreground">
                                            No saved address found on your profile. Add one in{' '}
                                            <Link href={`/${user.id}/profile`} className="underline">
                                                profile settings
                                            </Link>{' '}
                                            or fill it in here.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="text-xl">Payment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {savedCards.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-sm">Saved cards</Label>
                                            <div className="space-y-2">
                                                {savedCards.map((card) => (
                                                    <button
                                                        key={card.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setPaymentChoiceOverride('saved');
                                                            setSelectedSavedCardId(card.id);
                                                        }}
                                                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                            effectivePaymentChoice === 'saved' && effectiveSelectedSavedCardId === card.id
                                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                                : 'border-gray-300 bg-white hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <p className="font-medium">
                                                            {card.brand ?? 'Card'} ending in {card.last4}
                                                        </p>
                                                        <p className="text-xs opacity-80">
                                                            {card.holderName} | Expires {card.expiry}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant={effectivePaymentChoice === 'new' ? 'default' : 'outline'}
                                                    onClick={() => setPaymentChoiceOverride('new')}
                                                >
                                                    Use New Card
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={effectivePaymentChoice === 'cash' ? 'default' : 'outline'}
                                                    onClick={() => setPaymentChoiceOverride('cash')}
                                                >
                                                    Cash on Delivery
                                                </Button>
                                                {user?.id && (
                                                    <Button type="button" variant="ghost" asChild>
                                                        <Link href={`/${user.id}/profile`}>Manage Cards</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {savedCards.length === 0 && (
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentChoiceOverride('new')}
                                                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                                    effectivePaymentChoice === 'new'
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                Credit or debit card
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentChoiceOverride('cash')}
                                                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                                    effectivePaymentChoice === 'cash'
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-300 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                Cash on delivery
                                            </button>
                                        </div>
                                    )}

                                    {effectivePaymentChoice === 'new' && (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="cardNumber">Card number</Label>
                                                <Input
                                                    id="cardNumber"
                                                    inputMode="numeric"
                                                    maxLength={19}
                                                    value={form.cardNumber}
                                                    onChange={(e) =>
                                                        onFormFieldChange('cardNumber', e.target.value)
                                                    }
                                                    placeholder="4242 4242 4242 4242"
                                                    required={effectivePaymentChoice === 'new'}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardName">Cardholder name</Label>
                                                <Input
                                                    id="cardName"
                                                    value={form.cardName}
                                                    onChange={(e) => onFormFieldChange('cardName', e.target.value)}
                                                    placeholder="Jane Doe"
                                                    required={effectivePaymentChoice === 'new'}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="cardExpiry">Expiry</Label>
                                                    <Input
                                                        id="cardExpiry"
                                                        maxLength={5}
                                                        value={form.cardExpiry}
                                                        onChange={(e) =>
                                                            onFormFieldChange('cardExpiry', e.target.value)
                                                        }
                                                        placeholder="MM/YY"
                                                        required={effectivePaymentChoice === 'new'}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cardCvc">CVC</Label>
                                                    <Input
                                                        id="cardCvc"
                                                        maxLength={4}
                                                        inputMode="numeric"
                                                        value={form.cardCvc}
                                                        onChange={(e) => onFormFieldChange('cardCvc', e.target.value)}
                                                        placeholder="123"
                                                        required={effectivePaymentChoice === 'new'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {effectivePaymentChoice === 'cash' && (
                                        <p className="text-sm text-muted-foreground">
                                            You will pay in cash when your order is delivered.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-gray-200 h-fit lg:sticky lg:top-24">
                            <CardHeader>
                                <CardTitle className="text-xl">Order summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-white">
                                                <Image
                                                    fill
                                                    src={item.image}
                                                    alt={item.name}
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>Free</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <p className="text-base font-semibold">Total</p>
                                    <p className="text-lg font-semibold">${grandTotal.toFixed(2)}</p>
                                </div>

                                <Button className="w-full" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Placing order...' : 'Place Order'}
                                </Button>
                                <Button className="w-full" variant="outline" type="button" asChild>
                                    <Link href="/cart">Back to cart</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </main>
        </div>
    );
}
