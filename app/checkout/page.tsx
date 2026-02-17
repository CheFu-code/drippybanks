'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/config/firebaseConfig';
import { useCart } from '@/context/CartContext';
import { useAuthUser } from '@/hooks/useAuthUser';
import { CheckoutFormLayout } from './_components/CheckoutFormLayout';
import {
    EmptyCartCheckoutCard,
    LoadingCheckoutCard,
    OrderConfirmationCard,
} from './_components/CheckoutStates';
import { CheckoutForm, PaymentChoice, SavedOrder, SavedPaymentMethod } from './_components/types';

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
    const [paymentChoiceOverride, setPaymentChoiceOverride] = useState<PaymentChoice | null>(null);

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
    const isCardPaymentSelected = effectivePaymentChoice !== 'cash';

    const shipping = 0;
    const tax = 0;
    const grandTotal = cartTotal + shipping + tax;

    const onFormFieldChange = useCallback((field: keyof CheckoutForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    useEffect(() => {
        if (!user) return;

        if (!form.fullName && user.fullname) {
            onFormFieldChange('fullName', user.fullname);
        }
        if (!form.email && user.email) {
            onFormFieldChange('email', user.email);
        }
        if (!form.phone && user.phone) {
            onFormFieldChange('phone', user.phone);
        }
    }, [user, form.fullName, form.email, form.phone, onFormFieldChange]);

    useEffect(() => {
        if (!userLoading && !user) {
            router.replace('/login?next=/checkout');
        }
    }, [userLoading, user, router]);

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

        if (!user) {
            toast.error('Please sign in to place an order.');
            router.push('/login?next=/checkout');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        const finalPaymentMethod = effectivePaymentChoice === 'cash' ? 'cash' : 'card';
        if (finalPaymentMethod === 'card') {
            toast.info('Card payment is coming soon. Please use Cash on Delivery for now.');
            return;
        }

        const validationError = validateCheckout();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsSubmitting(true);

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

        const fullName = form.fullName.trim() || user?.fullname?.trim() || '';
        const email = form.email.trim() || user?.email?.trim() || '';
        const phone = form.phone.trim() || user?.phone?.trim() || '';

        const order: SavedOrder = {
            id: `ORD-${crypto.randomUUID()}`,
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

            await setDoc(doc(db, 'drippy-banks-orders', order.id), firestoreOrder);

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

                {userLoading && <LoadingCheckoutCard />}
                {!userLoading && !user && (
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl">Sign in required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                You need an account to continue with checkout and place orders.
                            </p>
                            <div className="flex items-center gap-3">
                                <Button asChild>
                                    <Link href="/login?next=/checkout">Go to Login</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/cart">Back to Cart</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {!userLoading && placedOrder && <OrderConfirmationCard placedOrder={placedOrder} />}
                {!userLoading && !placedOrder && cart.length === 0 && <EmptyCartCheckoutCard />}
                {!userLoading && user && !placedOrder && cart.length > 0 && (
                    <CheckoutFormLayout
                        user={user}
                        form={form}
                        cart={cart}
                        cartTotal={cartTotal}
                        grandTotal={grandTotal}
                        isSubmitting={isSubmitting}
                        hasSavedAddress={hasSavedAddress}
                        effectiveUseSavedAddress={effectiveUseSavedAddress}
                        effectivePaymentChoice={effectivePaymentChoice}
                        effectiveSelectedSavedCardId={effectiveSelectedSavedCardId}
                        isCardPaymentSelected={isCardPaymentSelected}
                        savedCards={savedCards}
                        onSubmit={handlePlaceOrder}
                        onFormFieldChange={onFormFieldChange}
                        onUseSavedAddress={() => setUseSavedAddressOverride(true)}
                        onUseDifferentAddress={() => setUseSavedAddressOverride(false)}
                        onSelectPaymentChoice={(choice) => setPaymentChoiceOverride(choice)}
                        onSelectSavedCard={(cardId) => {
                            setPaymentChoiceOverride('saved');
                            setSelectedSavedCardId(cardId);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
