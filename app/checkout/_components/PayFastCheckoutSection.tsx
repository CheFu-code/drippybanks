"use client";

import { CreditCard, Landmark, QrCode, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type PayFastCheckoutSectionProps = {
    grandTotal: number;
    isSubmitting: boolean;
    onPayFastSubmit: () => void;
};

export function PayFastCheckoutSection({
    grandTotal,
    isSubmitting,
    onPayFastSubmit,
}: PayFastCheckoutSectionProps) {
    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base tracking-tight">PayFast</h4>
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400">
                            payfast.io
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Secure South African payment gateway. Pay directly in ZAR.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    3D Secure Protected
                </div>
            </div>

            {/* Supported Payment Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white">Cards</p>
                        <p className="text-[10px] text-slate-400">Visa, Mastercard</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                        <Landmark className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white">Instant EFT</p>
                        <p className="text-[10px] text-slate-400">All Major SA Banks</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white">QR & Wallets</p>
                        <p className="text-[10px] text-slate-400">SnapScan, Zapper</p>
                    </div>
                </div>
            </div>

            {/* Inclusions checklist */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No hidden fees
                </span>
                <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant confirmation
                </span>
                <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encryption
                </span>
            </div>

            {/* Action Button */}
            <div className="pt-2">
                <Button
                    type="button"
                    onClick={onPayFastSubmit}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm h-12 shadow-[0_0_30px_rgba(239,68,68,0.25)] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connecting to PayFast...</span>
                        </>
                    ) : (
                        <>
                            <span>Pay with PayFast</span>
                            <span className="opacity-90">• R{grandTotal.toFixed(2)}</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
