import { AppUser } from '@/types/user';

export type CheckoutForm = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
};

export type PaymentChoice = 'payfast';
export type FulfillmentMethod = 'collect' | 'deliver';

export type SavedOrder = {
    id: string;
    date: string;
    status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    paymentMethod: 'payfast';
    payfastPaymentId?: string;
    fulfillmentMethod: FulfillmentMethod;
    deliveryFee: number;
    items: Array<{ id: string; name: string; quantity: number; price: number; image: string }>;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        paymentMethod: 'payfast';
    };
};


