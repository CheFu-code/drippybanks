import Image from 'next/image';
import Link from 'next/link';
import { AppUser } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/context/CartContext';
import { CheckoutForm, PaymentChoice, SavedPaymentMethod } from './types';

type CheckoutFormLayoutProps = {
    user: AppUser | null;
    form: CheckoutForm;
    cart: CartItem[];
    cartTotal: number;
    grandTotal: number;
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
};

export function CheckoutFormLayout({
    user,
    form,
    cart,
    cartTotal,
    grandTotal,
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
}: CheckoutFormLayoutProps) {
    return (
        <form className="grid gap-6 lg:grid-cols-[1.45fr_1fr]" onSubmit={onSubmit}>
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
                                            onClick={() => onSelectSavedCard(card.id)}
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
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    Credit or debit card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSelectPaymentChoice('cash')}
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
                            <p className="text-sm text-muted-foreground">
                                You will pay in cash when your order is delivered.
                            </p>
                        )}
                        {isCardPaymentSelected && (
                            <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                                Card payment is coming soon. Please select Cash on Delivery to place your order.
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
