"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-4xl rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden md:grid md:grid-cols-2">
                <div className="hidden md:flex flex-col items-start justify-center gap-6 p-10 bg-gradient-to-b from-emerald-50 to-white">
                    <Link href={'/'} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Image src="/drippybanks.png" alt="App logo" width={44} height={44} />
                        </div>
                        <span className="text-2xl font-semibold text-slate-900">Drippy Banks</span>
                    </Link>

                    <div className="mt-2">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-600 max-w-xs">One account for all your services — secure, fast, and simple.</p>
                    </div>

                    <p className="mt-auto text-xs text-slate-400">
                        By continuing you agree to our{" "}
                        <Link href="/privacy" className="underline hover:text-slate-600">
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/terms" className="underline hover:text-slate-600">
                            Terms
                        </Link>
                        .
                    </p>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex items-center md:hidden gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Image src="/drippybanks.png" alt="App logo" width={40} height={40} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Drippy Banks</h3>
                            <p className="text-sm text-slate-500">Sign in to continue</p>
                        </div>
                    </div>

                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    );
}
