"use client";

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { createPayPalOrderApi, capturePayPalOrderApi } from "@/lib/api/paypal";
import { CartItem } from "@/context/CartContext";

type PayPalCheckoutSectionProps = {
    grandTotal: number;
    cart: CartItem[];
    onValidate: () => string | null;
    onSuccess: (details: { orderId: string; payerEmail?: string }) => void;
    disabled?: boolean;
};

// Approximate ZAR to USD exchange rate for PayPal international checkout
const ZAR_TO_USD_RATE = 0.055;

export function PayPalCheckoutSection({
    grandTotal,
    cart,
    onValidate,
    onSuccess,
    disabled = false,
}: PayPalCheckoutSectionProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const usdAmount = Number((grandTotal * ZAR_TO_USD_RATE).toFixed(2));

    const handleCreateOrder = async () => {
        const validationError = onValidate();
        if (validationError) {
            toast.error(validationError);
            throw new Error(validationError);
        }

        try {
            // Try backend PayPal order creation first
            const backendOrder = await createPayPalOrderApi({
                amount: usdAmount > 0 ? usdAmount : 1,
                currency: "USD",
                items: cart.map((i) => ({
                    name: i.name,
                    quantity: i.quantity,
                    price: Number((i.price * ZAR_TO_USD_RATE).toFixed(2)),
                })),
            });
            return backendOrder.id;
        } catch (backendErr) {
            console.debug("[PayPal] Backend order creation fallback to client order:", backendErr);
            // Fallback to client-side order creation
            throw backendErr;
        }
    };

    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-white text-sm">PayPal Checkout</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Pay in USD (~${usdAmount.toFixed(2)} USD) via PayPal balance or card.
                    </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Buyer Protection
                </div>
            </div>

            {isProcessing && (
                <div className="py-6 flex items-center justify-center gap-2 text-amber-300">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Authorizing PayPal transaction...</span>
                </div>
            )}

            <div className={`relative ${isProcessing ? "opacity-30 pointer-events-none" : ""}`}>
                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                        height: 44,
                    }}
                    disabled={disabled || isProcessing}
                    createOrder={async (data, actions) => {
                        const validationError = onValidate();
                        if (validationError) {
                            toast.error(validationError);
                            return Promise.reject(new Error(validationError));
                        }

                        try {
                            return await handleCreateOrder();
                        } catch {
                            // Client actions fallback
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "USD",
                                            value: (usdAmount > 0 ? usdAmount : 1).toFixed(2),
                                        },
                                        description: "DrippyBanks Streetwear Order",
                                    },
                                ],
                            });
                        }
                    }}
                    onApprove={async (data, actions) => {
                        setIsProcessing(true);
                        try {
                            let payerEmail: string | undefined;

                            try {
                                const captured = await capturePayPalOrderApi(data.orderID);
                                const payer = captured.payer as Record<string, unknown> | undefined;
                                payerEmail = payer?.email_address as string | undefined;
                            } catch (captureErr) {
                                console.debug("[PayPal] Backend capture fallback to client actions:", captureErr);
                                if (actions.order) {
                                    const details = await actions.order.capture();
                                    payerEmail = details.payer?.email_address;
                                }
                            }

                            onSuccess({
                                orderId: data.orderID,
                                payerEmail,
                            });
                        } catch (err: unknown) {
                            console.error("[PayPal] Approval failed:", err);
                            const msg = err instanceof Error ? err.message : "Payment authorization failed.";
                            toast.error(msg);
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                    onError={(err) => {
                        console.error("[PayPal] Button error:", err);
                        toast.error("PayPal encountered an issue. Please try again or choose another payment method.");
                    }}
                    onCancel={() => {
                        toast.info("PayPal payment was cancelled.");
                    }}
                />
            </div>
        </div>
    );
}
