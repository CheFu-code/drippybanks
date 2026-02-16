import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppUser } from "@/types/user";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import type React from "react";
import { getCardBrandIcon } from "./cardBrand";

type PaymentMethod = NonNullable<AppUser["paymentMethods"]>[number];

type PaymentTabProps = {
    cardForm: {
        cardHolderName: string;
        setCardHolderName: React.Dispatch<React.SetStateAction<string>>;
        cardNumber: string;
        handleCardNumberChange: (value: string) => void;
        detectedCardBrand: string;
        cardExpiry: string;
        handleCardExpiryChange: (value: string) => void;
        cardCvv: string;
        handleCardCvvChange: (value: string) => void;
        cardBillingPostalCode: string;
        setCardBillingPostalCode: React.Dispatch<React.SetStateAction<string>>;
    };
    methods: {
        savedPaymentMethods: PaymentMethod[];
        handleSaveCard: () => void;
        handleRemoveCard: (paymentMethodId: string) => void;
        loading: boolean;
    };
    ui: {
        isPaymentFormOpen: boolean;
        setIsPaymentFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    };
};

export const PaymentTab = ({
    cardForm,
    methods,
    ui,
}: PaymentTabProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
            {methods.savedPaymentMethods.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <p className="text-sm text-gray-500">No payment methods saved yet.</p>
                </div>
            ) : (
                methods.savedPaymentMethods.map((method) => {
                    const CardBrandIcon = getCardBrandIcon(method.brand);
                    return (
                        <div
                            key={method.id}
                            className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <CardBrandIcon className="h-6 w-6 text-gray-700" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {method.brand ?? "Card"} *****{method.last4}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {method.holderName ?? "Cardholder"} - Expires {method.expiry}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Billing ZIP {method.billingPostalCode ?? "N/A"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => methods.handleRemoveCard(method.id)}
                                disabled={method.isDefault}
                                className={`text-sm font-medium ${method.isDefault
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-red-600"
                                    }`}
                            >
                                {method.isDefault ? "Default Card" : "Remove"}
                            </button>
                        </div>
                    );
                })
            )}

            <button
                onClick={() => ui.setIsPaymentFormOpen((prev) => !prev)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
            >
                <CreditCard className="h-5 w-5" />
                {ui.isPaymentFormOpen ? "Close Card Form" : "Add New Card"}
            </button>

            {ui.isPaymentFormOpen && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Add Payment Card</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Cardholder Name</Label>
                            <Input
                                value={cardForm.cardHolderName}
                                onChange={(e) => cardForm.setCardHolderName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Card Number</Label>
                            <Input
                                value={cardForm.cardNumber}
                                onChange={(e) => cardForm.handleCardNumberChange(e.target.value)}
                                placeholder="4242 4242 4242 4242"
                                inputMode="numeric"
                                maxLength={19}
                            />
                            <p className="text-xs text-gray-500">
                                Detected card type: {cardForm.detectedCardBrand}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Expiry (MM/YY)</Label>
                            <Input
                                value={cardForm.cardExpiry}
                                onChange={(e) => cardForm.handleCardExpiryChange(e.target.value)}
                                placeholder="12/26"
                                maxLength={5}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">CVV</Label>
                                <Input
                                    value={cardForm.cardCvv}
                                    onChange={(e) => cardForm.handleCardCvvChange(e.target.value)}
                                    placeholder="123"
                                    inputMode="numeric"
                                    maxLength={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Billing ZIP / Postal Code
                                </Label>
                                <Input
                                    value={cardForm.cardBillingPostalCode}
                                    onChange={(e) => cardForm.setCardBillingPostalCode(e.target.value)}
                                    placeholder="0002"
                                />
                            </div>
                        </div>

                        <Button onClick={methods.handleSaveCard} disabled={methods.loading} className="w-full">
                            {methods.loading ? "Saving..." : "Save Card"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
};
