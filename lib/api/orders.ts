import { apiUrl } from "@/config/chefuAuth";

export type OrderStatus =
    | "Processing"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export interface StoredOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface StoredOrder {
    id: string;
    date: string;
    status: OrderStatus;
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    deliveryFee: number;
    fulfillmentMethod: "collect" | "deliver";
    paymentMethod: "payfast";
    items: StoredOrderItem[];
    customer: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        paymentMethod: "payfast";
    };
    promoCode?: string;
    promoDiscountPercent?: number;
    paymentStatus?: PaymentStatus;
    payfastPaymentId?: string;
    paidAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function createOrderApi(order: StoredOrder): Promise<StoredOrder> {
    const res = await fetch(apiUrl("/drippybanks/orders"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to create order (${res.status})`);
    }

    return (await res.json()) as StoredOrder;
}

export async function fetchMyOrdersApi(): Promise<StoredOrder[]> {
    const res = await fetch(apiUrl("/drippybanks/orders/me"), {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch your orders: ${res.status}`);
    }

    const data = (await res.json()) as { orders?: StoredOrder[] };
    return data.orders ?? [];
}

export async function fetchOrderByIdApi(orderId: string): Promise<StoredOrder> {
    const res = await fetch(apiUrl(`/drippybanks/orders/${encodeURIComponent(orderId)}`), {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to fetch order (${res.status})`);
    }

    const data = (await res.json()) as { order: StoredOrder };
    return data.order;
}

export async function fetchAdminOrdersApi(): Promise<StoredOrder[]> {
    const res = await fetch(apiUrl("/drippybanks/orders"), {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch admin orders: ${res.status}`);
    }

    const data = (await res.json()) as { orders?: StoredOrder[] };
    return data.orders ?? [];
}

export async function updateAdminOrderStatusApi(
    orderId: string,
    status: OrderStatus,
): Promise<StoredOrder> {
    const res = await fetch(apiUrl(`/drippybanks/orders/${encodeURIComponent(orderId)}/status`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to update order status (${res.status})`);
    }

    const data = (await res.json()) as { order: StoredOrder };
    return data.order;
}
