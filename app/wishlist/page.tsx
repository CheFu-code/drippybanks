'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Home/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WishlistPage() {
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
