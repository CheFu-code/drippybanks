"use client";

import { useEffect } from "react";
import { buildChefuRegisterUrl, makeChefuReturnUrl } from "@/config/chefuAuth";

interface RegisterPageProps {
    searchParams: {
        next?: string | string[];
    };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
    const next = Array.isArray(searchParams.next)
        ? searchParams.next[0]
        : searchParams.next ?? "/";
    const returnTo = makeChefuReturnUrl(next);
    const target = buildChefuRegisterUrl(returnTo);

    useEffect(() => {
        window.location.assign(target);
    }, [target]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80 mb-4">
                    Join the premium network
                </p>
                <h1 className="text-4xl font-semibold tracking-tight mb-6">
                    Create your CheFu Account
                </h1>
                <p className="text-slate-300 leading-relaxed mb-8">
                    Register through CheFu Account to unlock premium access, order tracking, and a seamless shopping experience across the CheFu family of apps.
                </p>
                <div className="rounded-full bg-slate-800/80 p-5 text-center text-slate-400">
                    Redirecting now… If nothing happens,{' '}
                    <a href={target} className="text-amber-300 hover:text-amber-200 transition-colors">
                        click here
                    </a>
                    .
                </div>
            </div>
        </div>
    );
}
