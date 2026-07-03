"use client";

import { useEffect } from "react";
import { buildChefuLoginUrl, makeChefuReturnUrl } from "@/config/chefuAuth";

interface LoginPageProps {
    searchParams: {
        next?: string | string[];
    };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
    const next = Array.isArray(searchParams.next)
        ? searchParams.next[0]
        : searchParams.next ?? "/";
    const returnTo = makeChefuReturnUrl(next);
    const target = buildChefuLoginUrl(returnTo);

    useEffect(() => {
        window.location.assign(target);
    }, [target]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80 mb-4">
                    Secure sign in
                </p>
                <h1 className="text-4xl font-semibold tracking-tight mb-6">
                    Continue with CheFu Account
                </h1>
                <p className="text-slate-300 leading-relaxed mb-8">
                    You are being redirected to CheFu Account to complete authentication and keep your session secure across the CheFu ecosystem.
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
