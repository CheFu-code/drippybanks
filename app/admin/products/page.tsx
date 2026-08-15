"use client";

import type { Product } from "@/context/CartContext";
import { useStoredProducts } from "@/hooks/useStoredProducts";

import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AdminProductsPageUI from "./UI/AdminProductsPageUI";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [stockFilter, setStockFilter] = useState<
        "all" | "inStock" | "lowStock" | "outOfStock"
    >("all");
    const [sortBy, setSortBy] = useState<
        "newest" | "priceAsc" | "priceDesc" | "name" | "stock"
    >("newest");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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
        const lowStockCount = products.filter(
            (p) => (p.stock ?? 50) < 15 && p.inStock !== false,
        ).length;
        const featuredCount = products.filter((p) => p.featured).length;
        const avgPrice =
            total > 0 ? products.reduce((acc, p) => acc + p.price, 0) / total : 0;

        return { total, inStockCount, lowStockCount, featuredCount, avgPrice };
    }, [products]);

    // Filtered & Sorted products
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return products
            .filter((p) => {
                const matchesCategory =
                    selectedCategory === "All" || p.category === selectedCategory;
                const matchesSearch =
                    query.length === 0 ||
                    p.name.toLowerCase().includes(query) ||
                    p.id.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query) ||
                    Boolean(p.badge && p.badge.toLowerCase().includes(query));

                let matchesStock = true;
                if (stockFilter === "inStock") matchesStock = p.inStock !== false;
                if (stockFilter === "lowStock")
                    matchesStock = (p.stock ?? 50) < 15 && p.inStock !== false;
                if (stockFilter === "outOfStock") matchesStock = p.inStock === false;

                return matchesCategory && matchesSearch && matchesStock;
            })
            .sort((a, b) => {
                if (sortBy === "newest") {
                    return (
                        new Date(b.createdAt || 0).getTime() -
                        new Date(a.createdAt || 0).getTime() ||
                        Number(b.id) - Number(a.id)
                    );
                }
                if (sortBy === "priceAsc") return a.price - b.price;
                if (sortBy === "priceDesc") return b.price - a.price;
                if (sortBy === "name") return a.name.localeCompare(b.name);
                if (sortBy === "stock") return (b.stock ?? 0) - (a.stock ?? 0);
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

    const handleSaveProduct = (
        productData: Omit<Product, "id"> & { id?: string },
    ) => {
        if (productData.id) {
            updateProduct(productData.id, productData);
        } else {
            addProduct(productData);
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (
            confirm(`Are you sure you want to remove "${name}" from the catalog?`)
        ) {
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
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `drippybanks-products-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Catalog exported successfully.");
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
                    toast.error(res.error || "Failed to import catalog.");
                }
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    return (
        <AdminProductsPageUI
            router={router}
            handleOpenCreate={handleOpenCreate}
            handleExport={handleExport}
            metrics={metrics}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            handleOpenEdit={handleOpenEdit}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredProducts={filteredProducts}
            handleDuplicate={handleDuplicate}
            toggleStock={toggleStock}
            handleDelete={handleDelete}
            handleSaveProduct={handleSaveProduct}
            categoryCounts={categoryCounts}
            isStudioOpen={isStudioOpen}
            setIsStudioOpen={setIsStudioOpen}
            editingProduct={editingProduct}
        />
    );
}
