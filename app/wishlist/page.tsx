'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function WishlistPage() {
    const { user, loading } = useAuthUser();

    if (loading) {
        return (
            <div className="min-h-screen p-5 bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                <Navbar />
                <main className="pt-24 max-w-5xl mx-auto">
                    <Card className="bg-slate-900/80 border-white/10">
                        <CardContent className="py-10 text-center text-slate-300">
                            Loading wishlist...
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen p-5 bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
                <Navbar />
                <main className="pt-24 max-w-5xl mx-auto">
                    <Card className="bg-slate-900/80 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign in required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-slate-400">
                                Please log in to view and manage your wishlist.
                            </p>
                            <Button asChild>
                                <Link href="/login?next=/wishlist">Go to Login</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    // TODO(wishlist): Fetch authenticated AppUser.wishlist and render saved items when backend wiring is ready.
    return (
        <div className="min-h-screen p-5 bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950">
            <Navbar />
            <main className="pt-24 max-w-5xl mx-auto">
                <Card className="bg-slate-900/80 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-2xl">Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-slate-400">Your wishlist is empty.</p>
                        <Button asChild>
                            <Link href="/shop">Browse products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
