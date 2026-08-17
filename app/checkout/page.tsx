'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuthUser } from '@/hooks/useAuthUser';
import { buildChefuAuthRedirectUrl } from '@/config/chefuAuth';
import { CheckoutFormLayout } from './_components/CheckoutFormLayout';
import {
    EmptyCartCheckoutCard,
    LoadingCheckoutCard,
    OrderConfirmationCard,
} from './_components/CheckoutStates';
import { CheckoutForm, FulfillmentMethod, SavedOrder } from './_components/types';
import { generatePayFastPaymentApi, submitPayFastForm } from '@/lib/api/payfast';
import { createOrderApi, fetchOrderByIdApi } from '@/lib/api/orders';
import {
    getStoredPromoCode,
    saveStoredPromoCode,
    resolvePromoDiscount,
    isValidPromoCode,
    DEFAULT_PROMO_CODE,
    DEFAULT_PROMO_DISCOUNT
} from '@/lib/promo';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: userLoading } = useAuthUser();
    const { cart, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<SavedOrder | null>(null);
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
    const [promoApplied, setPromoApplied] = useState(false);
    const [activeDiscountPercent, setActiveDiscountPercent] = useState<number>(10);
    const [form, setForm] = useState<CheckoutForm>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'South Africa',
    });
    const [useSavedAddressOverride, setUseSavedAddressOverride] = useState<boolean | null>(null);
    const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('collect');

    const hasSavedAddress = Boolean(
        user?.addressStreet && user?.addressCity && user?.addressPostalCode && user?.country?.name,
    );
    const effectiveUseSavedAddress = useSavedAddressOverride ?? hasSavedAddress;

    const shipping = 0;
    const tax = 0;
    const deliveryFee = fulfillmentMethod === 'deliver' ? 60 : 0;
    const effectivePromoDiscount = promoApplied ? activeDiscountPercent : 0;
    const promoDiscountAmount = Number(((cartTotal * effectivePromoDiscount) / 100).toFixed(2));
    const subtotalAfterPromo = Math.max(0, Number((cartTotal - promoDiscountAmount).toFixed(2)));
    const grandTotal = subtotalAfterPromo + shipping + tax + deliveryFee;

    const onFormFieldChange = useCallback((field: keyof CheckoutForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Prefill form from authenticated user
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

    const applyPromoCode = useCallback((codeToApply?: string) => {
        const targetCode = (codeToApply ?? promoCodeInput).trim().toUpperCase();
        if (!targetCode) {
            setPromoCodeError('Please enter a promo code.');
            return false;
        }

        // Check if user has an assigned welcome promo
        if (user?.welcomePromo?.code && targetCode === user.welcomePromo.code.toUpperCase()) {
            const discount = user.welcomePromo.discountPercent ?? 10;
            setActiveDiscountPercent(discount);
            setPromoCodeInput(targetCode);
            setPromoCodeError(null);
            setPromoApplied(true);
            saveStoredPromoCode(targetCode, discount);
            return true;
        }

        // Check general promotional / WhatsApp promo campaigns
        if (isValidPromoCode(targetCode)) {
            const discount = resolvePromoDiscount(targetCode);
            setActiveDiscountPercent(discount);
            setPromoCodeInput(targetCode);
            setPromoCodeError(null);
            setPromoApplied(true);
            saveStoredPromoCode(targetCode, discount);
            return true;
        }

        setPromoCodeError('Invalid or expired promo code.');
        setPromoApplied(false);
        return false;
    }, [promoCodeInput, user]);

    // Auto-detect promo code from URL params, storage, or user profile
    useEffect(() => {
        const paramPromo = searchParams.get('promo') || searchParams.get('code');
        const stored = getStoredPromoCode();
        const initialCode = paramPromo || stored?.code || user?.welcomePromo?.code;

        if (initialCode) {
            applyPromoCode(initialCode);
        }
    }, [searchParams, user, applyPromoCode]);

    // Handle PayFast return redirects
    useEffect(() => {
        let isActive = true;
        const isSuccess = searchParams.get('payfast_success');
        const orderId = searchParams.get('order_id');
        const isCancelled = searchParams.get('cancelled');

        if (isSuccess === 'true' && orderId && user) {
            const loadOrder = async () => {
                try {
                    const order = await fetchOrderByIdApi(orderId);
                    if (!isActive) return;
                    setPlacedOrder(order as SavedOrder);
                    clearCart();
                    toast.success(`Payment confirmed! Order ${orderId} received.`);
                } catch {
                    if (!isActive) return;
                    toast.success('Payment completed successfully!');
                }
            };
            void loadOrder();
        } else if (isCancelled === 'true') {
            toast.info('PayFast payment was cancelled. You can try again when ready.');
        }

        return () => {
            isActive = false;
        };
    }, [searchParams, clearCart, user]);

    useEffect(() => {
        if (!userLoading && !user && typeof window !== 'undefined') {
            window.location.assign(buildChefuAuthRedirectUrl('/checkout', window.location.origin));
        }
    }, [userLoading, user]);

    const validateCheckout = () => {
        const fullName = form.fullName.trim() || user?.fullname?.trim() || '';
        const email = form.email.trim() || user?.email?.trim() || '';
        const phone = form.phone.trim() || user?.phone?.trim() || '';

        if (!fullName) return 'Full name is required.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
        if (!phone) return 'Phone number is required.';

        if (!effectiveUseSavedAddress && fulfillmentMethod === 'deliver') {
            if (!form.address.trim()) return 'Address is required for delivery.';
            if (!form.city.trim()) return 'City is required for delivery.';
            if (!form.postalCode.trim()) return 'Postal code is required for delivery.';
            if (!form.country.trim()) return 'Country is required for delivery.';
        }

        return null;
    };

    const handlePayFastSubmit = async () => {
        if (!user) {
            toast.error('Please sign in to place an order.');
            router.push('/login?next=/checkout');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty.');
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
                country: user?.country?.name ?? 'South Africa',
            }
            : {
                address: form.address,
                city: form.city,
                postalCode: form.postalCode,
                country: form.country || 'South Africa',
            };

        const fullName = form.fullName.trim() || user?.fullname?.trim() || 'Valued Customer';
        const email = form.email.trim() || user?.email?.trim() || 'customer@chefuinc.com';
        const phone = form.phone.trim() || user?.phone?.trim() || '';

        if (!promoApplied && promoCodeInput.trim()) {
            const valid = applyPromoCode();
            if (!valid) {
                setIsSubmitting(false);
                return;
            }
        }

        const orderId = `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

        const order: SavedOrder = {
            id: orderId,
            date: new Date().toISOString(),
            status: 'Processing',
            total: Number(grandTotal.toFixed(2)),
            subtotal: Number(subtotalAfterPromo.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            deliveryFee: Number(deliveryFee.toFixed(2)),
            fulfillmentMethod,
            paymentMethod: 'payfast',
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
                paymentMethod: 'payfast',
            },
        };

        try {
            await createOrderApi({
                ...order,
                promoCode: promoApplied ? promoCodeInput.trim().toUpperCase() : undefined,
                promoDiscountPercent: promoApplied ? effectivePromoDiscount : undefined,
            });

            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://drippybanks.chefuinc.com';
            const returnUrl = `${currentOrigin}/checkout?payfast_success=true&order_id=${orderId}`;
            const cancelUrl = `${currentOrigin}/checkout?cancelled=true`;

            // Request signed payment parameters from backend
            const paymentData = await generatePayFastPaymentApi({
                orderId,
                amount: grandTotal,
                itemName: `DrippyBanks Order #${orderId}`,
                customer: {
                    fullName,
                    email,
                    phone,
                },
                returnUrl,
                cancelUrl,
            });

            // Redirect customer to PayFast payment screen
            submitPayFastForm(paymentData);
        } catch (error) {
            console.error('Failed to initiate PayFast payment:', error);
            const msg = error instanceof Error ? error.message : 'Failed to initialize payment.';
            toast.error(msg);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />
            <main className="max-w-6xl mx-auto px-5 pb-12 pt-24">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Secure checkout</p>
                    <h1 className="text-3xl font-semibold mt-2 text-white">Complete your order</h1>
                </div>

                {userLoading && <LoadingCheckoutCard />}
                {!userLoading && !user && (
                    <Card className="border-white/10 bg-slate-900/80">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Sign in required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-slate-300">
                            <p className="text-sm text-slate-400">
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
                        deliveryFee={deliveryFee}
                        fulfillmentMethod={fulfillmentMethod}
                        isSubmitting={isSubmitting}
                        hasSavedAddress={hasSavedAddress}
                        effectiveUseSavedAddress={effectiveUseSavedAddress}
                        onFormFieldChange={onFormFieldChange}
                        onUseSavedAddress={() => setUseSavedAddressOverride(true)}
                        onUseDifferentAddress={() => setUseSavedAddressOverride(false)}
                        onSelectFulfillment={(method) => setFulfillmentMethod(method)}
                        onPayFastSubmit={handlePayFastSubmit}
                        promoCodeInput={promoCodeInput}
                        promoCodeError={promoCodeError}
                        promoApplied={promoApplied}
                        appliedDiscountPercent={effectivePromoDiscount}
                        onPromoCodeChange={(value) => {
                            setPromoCodeInput(value);
                            setPromoApplied(false);
                            if (promoCodeError) {
                                setPromoCodeError(null);
                            }
                        }}
                        onApplyPromoCode={() => {
                            if (promoCodeInput.trim()) {
                                const valid = applyPromoCode();
                                if (valid) {
                                    toast.success(`${effectivePromoDiscount || 10}% promo applied.`);
                                }
                            } else {
                                setPromoCodeError('Enter a promo code.');
                            }
                        }}
                    />
                )}
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                    <Navbar />
                    <main className="max-w-6xl mx-auto px-5 pb-12 pt-24">
                        <LoadingCheckoutCard />
                    </main>
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}



