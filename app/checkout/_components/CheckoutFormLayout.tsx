import Image from 'next/image';
import Link from 'next/link';
import { AppUser } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/context/CartContext';
import { CheckoutForm, FulfillmentMethod, PaymentChoice, SavedPaymentMethod } from './types';
import { MapPin, ShoppingBag } from 'lucide-react';

type CheckoutFormLayoutProps = {
    user: AppUser | null;
    form: CheckoutForm;
    cart: CartItem[];
    cartTotal: number;
    grandTotal: number;
    deliveryFee: number;
    fulfillmentMethod: FulfillmentMethod;
    isSubmitting: boolean;
    hasSavedAddress: boolean;
    effectiveUseSavedAddress: boolean;
    effectivePaymentChoice: PaymentChoice;
    effectiveSelectedSavedCardId: string;
    isCardPaymentSelected: boolean;
    savedCards: SavedPaymentMethod[];
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onFormFieldChange: (field: keyof CheckoutForm, value: string) => void;
    onUseSavedAddress: () => void;
    onUseDifferentAddress: () => void;
    onSelectPaymentChoice: (choice: PaymentChoice) => void;
    onSelectSavedCard: (cardId: string) => void;
    onSelectFulfillment: (method: FulfillmentMethod) => void;
};

export function CheckoutFormLayout({
    user,
    form,
    cart,
    cartTotal,
    grandTotal,
    deliveryFee,
    fulfillmentMethod,
    isSubmitting,
    hasSavedAddress,
    effectiveUseSavedAddress,
    effectivePaymentChoice,
    effectiveSelectedSavedCardId,
    isCardPaymentSelected,
    savedCards,
    onSubmit,
    onFormFieldChange,
    onUseSavedAddress,
    onUseDifferentAddress,
    onSelectPaymentChoice,
    onSelectSavedCard,
    onSelectFulfillment,
}: CheckoutFormLayoutProps) {
    return (
        <form className="grid gap-6 lg:grid-cols-[1.45fr_1fr]" onSubmit={onSubmit}>
            <div className="space-y-6">

                {/* ── Fulfillment picker ── */}
                <Card className="border-white/10 bg-slate-900/80 overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">How would you like to receive your order?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => onSelectFulfillment('collect')}
                                className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 ${
                                    fulfillmentMethod === 'collect'
                                        ? 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.3)]'
                                        : 'border-white/10 bg-slate-950/60 hover:bg-slate-800/60'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    fulfillmentMethod === 'collect' ? 'bg-amber-400/20' : 'bg-slate-800'
                                }`}>
                                    <ShoppingBag className={`w-4 h-4 ${
                                        fulfillmentMethod === 'collect' ? 'text-amber-300' : 'text-slate-400'
                                    }`} />
                                </div>
                                <div>
                                    <p className={`font-semibold text-sm ${
                                        fulfillmentMethod === 'collect' ? 'text-amber-300' : 'text-white'
                                    }`}>Collect in store</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Pick up at our location</p>
                                </div>
                                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                                    fulfillmentMethod === 'collect'
                                        ? 'bg-amber-400/20 text-amber-300'
                                        : 'bg-emerald-500/10 text-emerald-400'
                                }`}>Free</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onSelectFulfillment('deliver')}
                                className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 ${
                                    fulfillmentMethod === 'deliver'
                                        ? 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.3)]'
                                        : 'border-white/10 bg-slate-950/60 hover:bg-slate-800/60'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    fulfillmentMethod === 'deliver' ? 'bg-amber-400/20' : 'bg-slate-800'
                                }`}>
                                    <MapPin className={`w-4 h-4 ${
                                        fulfillmentMethod === 'deliver' ? 'text-amber-300' : 'text-slate-400'
                                    }`} />
                                </div>
                                <div>
                                    <p className={`font-semibold text-sm ${
                                        fulfillmentMethod === 'deliver' ? 'text-amber-300' : 'text-white'
                                    }`}>Home delivery</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Delivered to your door</p>
                                </div>
                                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                                    fulfillmentMethod === 'deliver'
                                        ? 'bg-amber-400/20 text-amber-300'
                                        : 'bg-slate-700 text-slate-300'
                                }`}>+ R60</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-slate-900/80">
                    <CardHeader>
                        <CardTitle className="text-xl">Contact information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fullName">Full name</Label>
                            <Input
                                id="fullName"
                                value={form.fullName}
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
                                value={form.email}
                                onChange={(e) => onFormFieldChange('email', e.target.value)}
                                placeholder="jane@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={form.phone}
                                onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                placeholder="+1 555 000 0000"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Shipping address — only shown for delivery ── */}
                {fulfillmentMethod === 'deliver' && (
                <Card className="border-white/10 bg-slate-900/80">
                    <CardHeader>
                        <CardTitle className="text-xl">Delivery address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {hasSavedAddress && effectiveUseSavedAddress ? (
                            <div className="rounded-lg border border-white/10 bg-slate-950/80 p-4">
                                <p className="text-sm font-medium">Using your saved address</p>
                                <p className="text-sm text-slate-400 mt-2">{user?.addressStreet}</p>
                                <p className="text-sm text-slate-400">
                                    {user?.addressCity} {user?.addressPostalCode}
                                </p>
                                <p className="text-sm text-slate-400">{user?.country?.name}</p>
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onUseDifferentAddress}
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
                                    <Button type="button" variant="outline" onClick={onUseSavedAddress}>
                                        Use Saved Address
                                    </Button>
                                )}
                            </div>
                        )}
                        {!hasSavedAddress && user?.id && (
                            <p className="text-xs text-slate-400">
                                No saved address found on your profile. Add one in{' '}
                                <Link href={`/${user.id}/profile`} className="underline text-amber-200 hover:text-white">
                                    profile settings
                                </Link>{' '}
                                or fill it in here.
                            </p>
                        )}
                    </CardContent>
                </Card>
                )}

                <Card className="border-white/10 bg-slate-900/80">
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
                                            onClick={() => onSelectSavedCard(card.id)}
                                            className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                                effectivePaymentChoice === 'saved' && effectiveSelectedSavedCardId === card.id
                                                    ? 'border-white/10 bg-slate-900 text-white'
                                                    : 'border-slate-700 bg-slate-950 hover:bg-slate-900'
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
                                        onClick={() => onSelectPaymentChoice('new')}
                                    >
                                        Use New Card
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={effectivePaymentChoice === 'cash' ? 'default' : 'outline'}
                                        onClick={() => onSelectPaymentChoice('cash')}
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
                                    onClick={() => onSelectPaymentChoice('new')}
                                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                        effectivePaymentChoice === 'new'
                                            ? 'border-white/20 bg-slate-800 text-white'
                                            : 'border-white/10 bg-slate-950/70 text-slate-100 hover:bg-slate-900'
                                    }`}
                                >
                                    Credit or debit card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSelectPaymentChoice('cash')}
                                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                                        effectivePaymentChoice === 'cash'
                                            ? 'border-white/20 bg-slate-800 text-white'
                                            : 'border-white/10 bg-slate-950/70 text-slate-100 hover:bg-slate-900'
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
                                        onChange={(e) => onFormFieldChange('cardNumber', e.target.value)}
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
                                            onChange={(e) => onFormFieldChange('cardExpiry', e.target.value)}
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
                            <p className="text-sm text-slate-400">
                                {fulfillmentMethod === 'collect'
                                    ? 'You will pay in cash when collecting your order at our store.'
                                    : 'You will pay in cash when your order is delivered to your address.'}
                            </p>
                        )}
                        {effectivePaymentChoice !== 'cash' && (
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                                End-to-end 256-bit encrypted card checkout
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/10 bg-slate-900/80 h-fit lg:sticky lg:top-24">
                <CardHeader>
                    <CardTitle className="text-xl">Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-white/10 bg-slate-950">
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
                                    <p className="text-sm text-slate-400">Qty {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium">
                                    R{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Separator />
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Subtotal</span>
                            <span>R{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Delivery</span>
                            {deliveryFee === 0 ? (
                                <span className="text-emerald-400 font-medium">Free</span>
                            ) : (
                                <span>R{deliveryFee.toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <p className="text-base font-semibold">Total</p>
                        <p className="text-lg font-semibold">R{grandTotal.toFixed(2)}</p>
                    </div>

                    <Button className="w-full" type="submit" disabled={isSubmitting || isCardPaymentSelected}>
                        {isSubmitting ? 'Placing order...' : 'Place Order'}
                    </Button>
                    <Button className="w-full" variant="outline" type="button" asChild>
                        <Link href="/cart">Back to cart</Link>
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
