import { apiUrl } from "@/config/chefuAuth";

export interface GeneratePayFastPaymentPayload {
    orderId: string;
    amount: number;
    itemName: string;
    itemDescription?: string;
    customer: {
        fullName: string;
        email: string;
        phone?: string;
    };
    returnUrl?: string;
    cancelUrl?: string;
}

export interface PayFastPaymentData {
    processUrl: string;
    fields: Record<string, string>;
}

export async function generatePayFastPaymentApi(
    payload: GeneratePayFastPaymentPayload,
): Promise<PayFastPaymentData> {
    const res = await fetch(apiUrl("/drippybanks/payfast/generate-payment"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorData.message || `Failed to initialize PayFast payment (${res.status})`);
    }

    return (await res.json()) as PayFastPaymentData;
}

export function submitPayFastForm(paymentData: PayFastPaymentData): void {
    if (typeof window === "undefined" || !document) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = paymentData.processUrl;
    form.style.display = "none";

    for (const [key, value] of Object.entries(paymentData.fields)) {
        if (value !== undefined && value !== null) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
