'use client';

import React, { useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    LayoutGrid,
    Table as TableIcon,
    Edit3,
    Copy,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Download,
    Upload,
    RotateCcw,
    ArrowLeft,
    DollarSign,
    Package,
    Star,
    ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/context/CartContext';
import { useStoredProducts } from '@/hooks/useStoredProducts';
import { PRODUCT_CATEGORIES } from '@/lib/product-store';
import { AdminProductStudioModal } from './_components/AdminProductStudioModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminProductsPage() {
    const router = useRouter();
    const {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleStock,
        resetToDefault,
        exportCatalog,
        importCatalog,
    } = useStoredProducts();

    // Studio Modal state
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Filter & Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'name' | 'stock'>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Hidden file input for catalog import
    const importInputRef = useRef<HTMLInputElement>(null);

    // Derived category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { All: products.length };
        products.forEach((p) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }, [products]);

    // Metrics
    const metrics = useMemo(() => {
        const total = products.length;
        const inStockCount = products.filter((p) => p.inStock !== false).length;
        const lowStockCount = products.filter((p) => (p.stock ?? 50) < 15 && p.inStock !== false).length;
        const featuredCount = products.filter((p) => p.featured).length;
        const avgPrice = total > 0 ? products.reduce((acc, p) => acc + p.price, 0) / total : 0;

        return { total, inStockCount, lowStockCount, featuredCount, avgPrice };
    }, [products]);

    // Filtered & Sorted products
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return products
            .filter((p) => {
                const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
                const matchesSearch =
                    query.length === 0 ||
                    p.name.toLowerCase().includes(query) ||
                    p.id.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query) ||
                    Boolean(p.badge && p.badge.toLowerCase().includes(query));

                let matchesStock = true;
                if (stockFilter === 'inStock') matchesStock = p.inStock !== false;
                if (stockFilter === 'lowStock') matchesStock = (p.stock ?? 50) < 15 && p.inStock !== false;
                if (stockFilter === 'outOfStock') matchesStock = p.inStock === false;

                return matchesCategory && matchesSearch && matchesStock;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') {
                    return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()) || Number(b.id) - Number(a.id);
                }
                if (sortBy === 'priceAsc') return a.price - b.price;
                if (sortBy === 'priceDesc') return b.price - a.price;
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                if (sortBy === 'stock') return (b.stock ?? 0) - (a.stock ?? 0);
                return 0;
            });
    }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

    // Action handlers
    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsStudioOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setEditingProduct(product);
        setIsStudioOpen(true);
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
        if (productData.id) {
            updateProduct(productData.id, productData);
        } else {
            addProduct(productData);
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
            deleteProduct(id);
            toast.success(`Removed "${name}" from catalog.`);
        }
    };

    const handleDuplicate = (id: string) => {
        const dup = duplicateProduct(id);
        if (dup) {
            toast.success(`Created duplicate variant: "${dup.name}"`);
        }
    };

    const handleExport = () => {
        const json = exportCatalog();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `drippybanks-products-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Catalog exported successfully.');
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                const res = importCatalog(content);
                if (res.success) {
                    toast.success(`Successfully imported ${res.count} products!`);
                } else {
                    toast.error(res.error || 'Failed to import catalog.');
                }
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleReset = () => {
        if (confirm('Reset catalog to official default collection? This will restore all standard Drippy Banks pieces.')) {
            resetToDefault();
            toast.success('Catalog reset to default collection.');
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950 pb-20">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl gap-2 text-xs"
                        >
                            <ArrowLeft size={16} /> Dashboard
                        </Button>
                        <span className="text-slate-700">/</span>
                        <span className="text-sm font-semibold text-white">DrippyBanks Studio</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs rounded-xl hidden sm:inline-flex"
                        >
                            <Link href="/shop" target="_blank">
                                <ExternalLink size={14} className="mr-1.5" /> View Live Shop
                            </Link>
                        </Button>

                        <Button
                            onClick={handleOpenCreate}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
                        >
                            <Plus size={18} className="stroke-[3]" /> Add New Product
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Hero Header Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-8 shadow-2xl">
                    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                                    <Sparkles className="h-3 w-3" /> DrippyBanks Control
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" /> Storefront Synced
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                                DrippyBanks Studio
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Add drops, configure multi-size selections, upload high-res photography, and manage pricing & inventory in real time.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                                className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white rounded-xl text-xs"
                            >
                                <Download size={14} className="mr-1.5" /> Export JSON
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => importInputRef.current?.click()}
                                className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white rounded-xl text-xs"
                            >
                                <Upload size={14} className="mr-1.5" /> Import JSON
                            </Button>
                            <input
                                ref={importInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImportFile}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="border-white/10 bg-slate-900/60 text-slate-400 hover:text-amber-300 rounded-xl text-xs"
                            >
                                <RotateCcw size={14} className="mr-1.5" /> Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>Total Catalog</span>
                                <Package className="h-4 w-4 text-amber-300" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">{metrics.total}</p>
                            <p className="text-[11px] text-slate-400 mt-1">Active streetwear pieces</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>In Stock Ratio</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-emerald-400">{metrics.inStockCount} <span className="text-sm text-slate-400">/ {metrics.total}</span></p>
                            <p className="text-[11px] text-slate-400 mt-1">Available for checkout</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>Featured Drops</span>
                                <Star className="h-4 w-4 text-amber-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-amber-400">{metrics.featuredCount}</p>
                            <p className="text-[11px] text-slate-400 mt-1">Highlighted on homepage</p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>Average Price</span>
                                <DollarSign className="h-4 w-4 text-cyan-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">R{metrics.avgPrice.toFixed(0)}</p>
                            <p className="text-[11px] text-slate-400 mt-1">Across all categories</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, ID, category, or badge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-900/80 border-white/10 text-white rounded-2xl placeholder:text-slate-500 h-11"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <XCircle size={16} />
                                </button>
                            )}
                        </div>

                        {/* Controls Strip */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                            {/* Stock Filter */}
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value as 'all' | 'inStock' | 'lowStock' | 'outOfStock')}
                                className="h-11 rounded-2xl border border-white/10 bg-slate-900/90 px-3.5 text-xs text-slate-200 outline-none focus:border-amber-300"
                            >
                                <option value="all">All Inventory</option>
                                <option value="inStock">In Stock Only</option>
                                <option value="lowStock">Low Stock (&lt; 15)</option>
                                <option value="outOfStock">Sold Out</option>
                            </select>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'priceAsc' | 'priceDesc' | 'name' | 'stock')}
                                className="h-11 rounded-2xl border border-white/10 bg-slate-900/90 px-3.5 text-xs text-slate-200 outline-none focus:border-amber-300"
                            >
                                <option value="newest">Newest First</option>
                                <option value="priceDesc">Price: High to Low</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="name">Name: A-Z</option>
                                <option value="stock">Stock Quantity</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-2xl p-1 h-11">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${viewMode === 'grid'
                                            ? 'bg-amber-400 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <LayoutGrid size={14} /> Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${viewMode === 'table'
                                            ? 'bg-amber-400 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <TableIcon size={14} /> Table
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {['All', ...PRODUCT_CATEGORIES].map((cat) => {
                            const count = categoryCounts[cat] || 0;
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${isSelected
                                            ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20'
                                            : 'bg-slate-900/70 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-slate-400'
                                            }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Product Listing */}
                {filteredProducts.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-amber-400/10 text-amber-300 mx-auto flex items-center justify-center">
                            <Package size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white">No products found</h3>
                        <p className="text-sm text-slate-400 max-w-md mx-auto">
                            No pieces match your search or filter criteria. Try resetting filters or add a new piece to the collection.
                        </p>
                        <div className="pt-2 flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setStockFilter('all');
                                }}
                                className="border-white/10 text-slate-300 rounded-xl"
                            >
                                Clear Filters
                            </Button>
                            <Button
                                onClick={handleOpenCreate}
                                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl"
                            >
                                <Plus size={16} className="mr-1" /> Add Product
                            </Button>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const isSoldOut = product.inStock === false;
                            const isLowStock = (product.stock ?? 50) < 15 && !isSoldOut;

                            return (
                                <div
                                    key={product.id}
                                    className="group rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden shadow-xl hover:border-amber-300/40 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image Area */}
                                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                                            {/* Category Tag */}
                                            <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                                                {product.category}
                                            </span>

                                            {/* Badge */}
                                            {product.badge && (
                                                <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Stock indicator */}
                                            <div className="absolute bottom-3 left-3.5">
                                                {isSoldOut ? (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500/30 text-[10px] font-bold text-red-300 backdrop-blur-md">
                                                        Sold Out
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/30 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                                                        Low Stock ({product.stock})
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 backdrop-blur-md">
                                                        In Stock ({product.stock ?? 50})
                                                    </span>
                                                )}
                                            </div>

                                            {/* Featured Star */}
                                            {product.featured && (
                                                <div className="absolute bottom-3 right-3.5 h-7 w-7 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg" title="Featured on Homepage">
                                                    <Star size={13} className="fill-slate-950" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                                                    <span>SKU #{product.id}</span>
                                                    <span>{product.fit || 'Regular fit'}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Sizes Available */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Sizes:</span>
                                                {(product.sizes || ['One Size']).map((s) => (
                                                    <span
                                                        key={s}
                                                        className="px-1.5 py-0.5 rounded-md bg-slate-950 border border-white/10 text-[10px] font-bold text-slate-300"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Price Row */}
                                            <div className="pt-2 flex items-baseline justify-between border-t border-white/10">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-extrabold text-amber-300">
                                                        R{product.price.toFixed(2)}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-slate-400 line-through">
                                                            R{product.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-4 pt-0 flex items-center gap-2 border-t border-white/5">
                                        <Button
                                            size="sm"
                                            onClick={() => handleOpenEdit(product)}
                                            className="flex-1 bg-white/5 hover:bg-amber-300 hover:text-slate-950 border border-white/10 text-white rounded-xl text-xs font-semibold transition-all gap-1.5"
                                        >
                                            <Edit3 size={13} /> Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDuplicate(product.id)}
                                            title="Duplicate Variant"
                                            className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                                        >
                                            <Copy size={14} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => toggleStock(product.id)}
                                            title={product.inStock === false ? 'Mark in stock' : 'Mark out of stock'}
                                            className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-white/10"
                                        >
                                            {product.inStock === false ? (
                                                <XCircle size={14} className="text-red-400" />
                                            ) : (
                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                            )}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(product.id, product.name)}
                                            title="Delete Product"
                                            className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Table View */
                    <div className="rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="py-4 px-6">Product</th>
                                        <th className="py-4 px-4">Category</th>
                                        <th className="py-4 px-4">Price</th>
                                        <th className="py-4 px-4">Sizes</th>
                                        <th className="py-4 px-4">Stock</th>
                                        <th className="py-4 px-4">Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex-shrink-0">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm line-clamp-1">{product.name}</p>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                            <span>ID: {product.id}</span>
                                                            {product.badge && (
                                                                <span className="text-amber-300 font-semibold">{product.badge}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-amber-300 font-semibold">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-white text-sm">
                                                R{product.price.toFixed(2)}
                                                {product.originalPrice && (
                                                    <span className="block text-[10px] text-slate-400 line-through">
                                                        R{product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {(product.sizes || ['One Size']).map((s) => (
                                                        <span
                                                            key={s}
                                                            className="px-1.5 py-0.5 rounded bg-slate-950 border border-white/10 text-[10px] font-semibold text-slate-300"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-200">
                                                {product.stock ?? 50} units
                                            </td>
                                            <td className="py-3 px-4">
                                                {product.inStock !== false ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-semibold">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleOpenEdit(product)}
                                                        className="h-8 px-2.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                                                    >
                                                        <Edit3 size={13} className="mr-1" /> Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDuplicate(product.id)}
                                                        title="Duplicate"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                                                    >
                                                        <Copy size={13} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        title="Delete"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                                                    >
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Studio Creator / Editor Modal */}
            <AdminProductStudioModal
                isOpen={isStudioOpen}
                onClose={() => setIsStudioOpen(false)}
                initialProduct={editingProduct}
                onSaveProduct={handleSaveProduct}
            />
        </main>
    );
}
