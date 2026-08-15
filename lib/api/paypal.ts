import { apiUrl } from "@/config/chefuAuth";

export interface CreatePayPalOrderPayload {
    amount: number;
    currency?: string;
    items?: Array<{ name: string; quantity: number; price: number }>;
}

export async function createPayPalOrderApi(payload: CreatePayPalOrderPayload): Promise<{ id: string; status: string }> {
    const res = await fetch(`${apiUrl}/drippybanks/paypal/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to create PayPal order (${res.status})`);
    }

    return (await res.json()) as { id: string; status: string };
}

export async function capturePayPalOrderApi(orderId: string): Promise<{ id: string; status: string; payer?: Record<string, unknown> }> {
    const res = await fetch(`${apiUrl}/drippybanks/paypal/capture-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to capture PayPal order (${res.status})`);
    }

    return (await res.json()) as { id: string; status: string; payer?: Record<string, unknown> };
}
