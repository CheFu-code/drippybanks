'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { Product } from '@/context/CartContext';
import {
    loadStoredProducts,
    PRODUCTS_UPDATED_EVENT,
    addStoredProduct,
    updateStoredProduct,
    deleteStoredProduct,
    duplicateStoredProduct,
    toggleStoredProductStock,
    resetStoredProductsToDefault,
    exportProductsToJson,
    importProductsFromJson,
    syncProductsFromBackend,
} from '@/lib/product-store';
import {
    fetchProductsApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    toggleProductStockApi,
    CreateProductPayload,
    UpdateProductPayload,
} from '@/lib/api/products';

let cachedProducts: Product[] = [];
let isInitialized = false;

function getSnapshot(): Product[] {
    if (typeof window === 'undefined') return [];
    if (!isInitialized) {
        cachedProducts = loadStoredProducts();
        isInitialized = true;
    }
    return cachedProducts;
}

function getServerSnapshot(): Product[] {
    return [];
}

function subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleUpdate = () => {
        cachedProducts = loadStoredProducts();
        callback();
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
        window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate);
        window.removeEventListener('storage', handleUpdate);
    };
}

export function useStoredProducts() {
    const products = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [isLoading, setIsLoading] = useState(false);

    const refreshProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const remoteProducts = await fetchProductsApi();
            if (Array.isArray(remoteProducts)) {
                cachedProducts = syncProductsFromBackend(remoteProducts);
            }
        } catch (err) {
            console.debug('[useStoredProducts] Backend fetch fallback to local cache:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshProducts();
    }, [refreshProducts]);

    const addProduct = useCallback(
        async (product: Omit<Product, 'id'> & { id?: string }): Promise<Product> => {
            try {
                const payload: CreateProductPayload = {
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    category: product.category,
                    image: product.image,
                    sizes: product.sizes,
                    colors: product.colors,
                    badge: product.badge,
                    description: product.description,
                    fit: product.fit,
                    inStock: product.inStock,
                    stock: product.stock,
                    featured: product.featured,
                };
                const created = await createProductApi(payload);
                addStoredProduct(created);
                cachedProducts = loadStoredProducts();
                return created;
            } catch (err) {
                console.error('[useStoredProducts] createProductApi failed, saving locally:', err);
                const local = addStoredProduct(product);
                cachedProducts = loadStoredProducts();
                return local;
            }
        },
        [],
    );

    const updateProduct = useCallback(
        async (id: string, updates: Partial<Product>): Promise<Product[]> => {
            try {
                const payload: UpdateProductPayload = {
                    name: updates.name,
                    price: updates.price,
                    originalPrice: updates.originalPrice,
                    category: updates.category,
                    image: updates.image,
                    sizes: updates.sizes,
                    colors: updates.colors,
                    badge: updates.badge,
                    description: updates.description,
                    fit: updates.fit,
                    inStock: updates.inStock,
                    stock: updates.stock,
                    featured: updates.featured,
                };
                const updated = await updateProductApi(id, payload);
                const next = updateStoredProduct(id, updated);
                cachedProducts = next;
                return next;
            } catch (err) {
                console.error('[useStoredProducts] updateProductApi failed, updating locally:', err);
                const local = updateStoredProduct(id, updates);
                cachedProducts = loadStoredProducts();
                return local;
            }
        },
        [],
    );

    const deleteProduct = useCallback(
        async (id: string): Promise<Product[]> => {
            try {
                await deleteProductApi(id);
                const remaining = deleteStoredProduct(id);
                cachedProducts = remaining;
                return remaining;
            } catch (err) {
                console.error('[useStoredProducts] deleteProductApi failed, removing locally:', err);
                const remaining = deleteStoredProduct(id);
                cachedProducts = loadStoredProducts();
                return remaining;
            }
        },
        [],
    );

    const duplicateProduct = useCallback((id: string) => {
        const duplicated = duplicateStoredProduct(id);
        cachedProducts = loadStoredProducts();
        return duplicated;
    }, []);

    const toggleStock = useCallback(
        async (id: string): Promise<Product[]> => {
            try {
                const toggled = await toggleProductStockApi(id);
                const next = updateStoredProduct(id, toggled);
                cachedProducts = next;
                return next;
            } catch (err) {
                console.error('[useStoredProducts] toggleStockApi failed, toggling locally:', err);
                const next = toggleStoredProductStock(id);
                cachedProducts = loadStoredProducts();
                return next;
            }
        },
        [],
    );

    const resetToDefault = useCallback(() => {
        const defaults = resetStoredProductsToDefault();
        cachedProducts = loadStoredProducts();
        return defaults;
    }, []);

    const exportCatalog = useCallback(() => exportProductsToJson(), []);

    const importCatalog = useCallback((json: string) => {
        const res = importProductsFromJson(json);
        if (res.success) {
            cachedProducts = loadStoredProducts();
        }
        return res;
    }, []);

    return {
        products,
        isLoading,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleStock,
        resetToDefault,
        exportCatalog,
        importCatalog,
    };
}
