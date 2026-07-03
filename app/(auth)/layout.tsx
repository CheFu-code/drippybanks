"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950/95 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Link
                        className="flex items-center gap-3 text-white"
                        href={'/'}
                    >
                        <Image src="/drippybanks.png" alt="Drippy Banks" width={56} height={56} />
                        <span className="text-2xl font-semibold tracking-tight">Drippy Banks</span>
                    </Link>
                    <p className="max-w-md text-sm text-slate-400">
                        One account across CheFu apps ensures a seamless premium experience while shopping Drippy Banks.
                    </p>
                </div>
                <div className="mt-8">{children}</div>
            </div>
        </div>
    );
}
