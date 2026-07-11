'use client'

import { useMemo, useState } from 'react';
import { Plus, Trash2, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/context/CartContext';
import { loadStoredProducts, saveStoredProducts } from '@/lib/product-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEFAULT_PRODUCT: Product = {
    id: '',
    name: '',
    price: 0,
    category: 'Tops',
    image: '/placeholder.png',
};

const CATEGORIES = ['Tops', 'Caps', 'Bags', 'Hoodies'];

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(() => loadStoredProducts());
    const [draft, setDraft] = useState<Product>(DEFAULT_PRODUCT);
    const [message, setMessage] = useState<string | null>(null);

    const sortedProducts = useMemo(
        () => [...products].sort((a, b) => Number(a.id) - Number(b.id)),
        [products],
    );

    const updateDraft = (field: keyof Product, value: string) => {
        setDraft((prev) => ({
            ...prev,
            [field]: field === 'price' ? Number(value) : value,
        }));
    };

    const handleAdd = () => {
        if (!draft.name.trim() || !draft.image.trim() || !draft.category.trim() || draft.price <= 0) {
            setMessage('Please fill product name, category, image path and a price above 0.');
            return;
        }

        const nextId = String(
            Math.max(0, ...products.map((product) => Number(product.id) || 0)) + 1,
        );

        const nextProduct = { ...draft, id: nextId };
        const nextProducts = [...products, nextProduct];
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        setDraft({ ...DEFAULT_PRODUCT });
        setMessage('Product added. Remember to place the image in /public and use the public path.');
    };

    const handleDelete = (id: string) => {
        const nextProducts = products.filter((product) => product.id !== id);
        setProducts(nextProducts);
        saveStoredProducts(nextProducts);
        setMessage('Product removed.');
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Product Management</h1>
                        <p className="mt-2 max-w-2xl text-slate-400">
                            Add new products for the shop and point to public images by path (for example `/capBlue.png`).
                        </p>
                    </div>
                    <Button variant="secondary" onClick={() => router.push('/admin/dashboard')}>
                        Back to dashboard
                    </Button>
                </div>

                <Card className="border-white/10 bg-slate-900/80">
                    <CardHeader>
                        <CardTitle>New Product</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={draft.name}
                                onChange={(event) => updateDraft('name', event.target.value)}
                                placeholder="Black Crop Tee"
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                value={draft.category}
                                onChange={(event) => updateDraft('category', event.target.value)}
                                className="mt-2 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-amber-300"
                            >
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                value={draft.price}
                                onChange={(event) => updateDraft('price', event.target.value)}
                                placeholder="400"
                            />
                        </div>
                        <div>
                            <Label htmlFor="image">Image Path</Label>
                            <Input
                                id="image"
                                value={draft.image}
                                onChange={(event) => updateDraft('image', event.target.value)}
                                placeholder="/capBlue.png"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-400">Use image paths under `/public` to display them in the shop.</p>
                        <Button onClick={handleAdd} className="inline-flex items-center gap-2">
                            <Plus size={16} /> Add Product
                        </Button>
                    </CardFooter>
                </Card>

                {message && (
                    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100">
                        {message}
                    </div>
                )}

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Existing Products</h2>
                            <p className="text-slate-500">Products are saved in browser storage for the admin experience.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                            <ImagePlus size={16} /> Place your image files in `public/`
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {sortedProducts.map((product) => (
                            <Card key={product.id} className="border-white/10 bg-slate-900/75">
                                <CardContent className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-slate-400">ID {product.id}</p>
                                            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                                            <p className="text-sm text-slate-400">{product.category}</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                            className="rounded-full p-2"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <div className="grid gap-2 text-sm text-slate-300">
                                        <p>Price: R{product.price}</p>
                                        <p>Image: {product.image}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
