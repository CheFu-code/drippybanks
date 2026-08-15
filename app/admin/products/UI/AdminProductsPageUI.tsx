import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    ArrowLeft,
    CheckCircle2,
    Copy,
    DollarSign,
    Download,
    Edit3,
    ExternalLink,
    LayoutGrid,
    Package,
    Plus,
    Search,
    Star,
    Table as TableIcon,
    Trash2,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminProductStudioModal } from "../_components/AdminProductStudioModal";
import { PRODUCT_CATEGORIES } from "@/lib/product-store";
import { AdminProductsPageUIProps } from "@/types/studio";

const AdminProductsPageUI = ({
    router,
    handleOpenCreate,
    handleExport,
    metrics,
    searchQuery,
    setSearchQuery,
    stockFilter,
    setStockFilter,
    handleOpenEdit,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    toggleStock,
    handleDelete,
    handleSaveProduct,
    categoryCounts,
    isStudioOpen,
    setIsStudioOpen,
    editingProduct
}:AdminProductsPageUIProps) => {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-300 selection:text-slate-950 pb-20">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/admin/dashboard")}
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl gap-2 text-xs"
                        >
                            <ArrowLeft size={16} /> Dashboard
                        </Button>
                        <span className="text-slate-700">/</span>
                        <span className="text-sm font-semibold text-white">
                            DrippyBanks Studio
                        </span>
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
                            className="bg-amber-400 cursor-pointer hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-1.5"
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
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                                DrippyBanks Studio
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Add drops, configure multi-size selections, upload high-res
                                photography, and manage pricing & inventory in real time.
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
                            <p className="mt-2 text-2xl font-bold text-white">
                                {metrics.total}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Active streetwear pieces
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>In Stock Ratio</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-emerald-400">
                                {metrics.inStockCount}{" "}
                                <span className="text-sm text-slate-400">
                                    / {metrics.total}
                                </span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Available for checkout
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>Featured Drops</span>
                                <Star className="h-4 w-4 text-amber-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-amber-400">
                                {metrics.featuredCount}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Highlighted on homepage
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-md">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between text-slate-400 text-xs">
                                <span>Average Price</span>
                                <DollarSign className="h-4 w-4 text-cyan-400" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">
                                R{metrics.avgPrice.toFixed(0)}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Across all categories
                            </p>
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
                                    onClick={() => setSearchQuery("")}
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
                                onChange={(e) =>
                                    setStockFilter(
                                        e.target.value as
                                        | "all"
                                        | "inStock"
                                        | "lowStock"
                                        | "outOfStock",
                                    )
                                }
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
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value as
                                        | "newest"
                                        | "priceAsc"
                                        | "priceDesc"
                                        | "name"
                                        | "stock",
                                    )
                                }
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
                                    onClick={() => setViewMode("grid")}
                                    className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${viewMode === "grid"
                                            ? "bg-amber-400 text-slate-950 shadow-md"
                                            : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    <LayoutGrid size={14} /> Grid
                                </button>
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${viewMode === "table"
                                            ? "bg-amber-400 text-slate-950 shadow-md"
                                            : "text-slate-400 hover:text-white"
                                        }`}
                                >
                                    <TableIcon size={14} /> Table
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {["All", ...PRODUCT_CATEGORIES].map((cat) => {
                            const count = categoryCounts[cat] || 0;
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${isSelected
                                            ? "bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20"
                                            : "bg-slate-900/70 border border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {cat}
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isSelected
                                                ? "bg-slate-950 text-amber-300"
                                                : "bg-white/10 text-slate-400"
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
                            No pieces match your search or filter criteria. Try resetting
                            filters or add a new piece to the collection.
                        </p>
                        <div className="pt-2 flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                    setStockFilter("all");
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
                ) : viewMode === "grid" ? (
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
                                                <div
                                                    className="absolute bottom-3 right-3.5 h-7 w-7 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg"
                                                    title="Featured on Homepage"
                                                >
                                                    <Star size={13} className="fill-slate-950" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                                                    <span>SKU #{product.id}</span>
                                                    <span>{product.fit || "Regular fit"}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            {/* Sizes Available */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                                    Sizes:
                                                </span>
                                                {(product.sizes || ["One Size"]).map((s) => (
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
                                            onClick={() => toggleStock(product.id)}
                                            title={
                                                product.inStock === false
                                                    ? "Mark in stock"
                                                    : "Mark out of stock"
                                            }
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
                                        <tr
                                            key={product.id}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
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
                                                        <p className="font-bold text-white text-sm line-clamp-1">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                            <span>ID: {product.id}</span>
                                                            {product.badge && (
                                                                <span className="text-amber-300 font-semibold">
                                                                    {product.badge}
                                                                </span>
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
                                                    {(product.sizes || ["One Size"]).map((s) => (
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
                                                        onClick={() =>
                                                            handleDelete(product.id, product.name)
                                                        }
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
};

export default AdminProductsPageUI;
