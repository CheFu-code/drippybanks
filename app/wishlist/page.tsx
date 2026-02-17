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
            <div className="min-h-screen p-5 bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
                <Navbar />
                <main className="pt-20 max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Loading wishlist...
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen p-5 bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
                <Navbar />
                <main className="pt-20 max-w-5xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign in required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">
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
        <div className="min-h-screen p-5 bg-gray-100 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
            <Navbar />
            <main className="pt-20 max-w-5xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-muted-foreground">Your wishlist is empty.</p>
                        <Button asChild>
                            <Link href="/shop">Browse products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
