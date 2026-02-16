import { AppUser } from '@/types/user';

export type CheckoutForm = {
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

export type PaymentChoice = 'saved' | 'new' | 'cash';

export type SavedPaymentMethod = NonNullable<AppUser['paymentMethods']>[number];

export type SavedOrder = {
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
