'use client';

import { useCallback, useSyncExternalStore } from 'react';
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
} from '@/lib/product-store';

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

    const addProduct = useCallback((product: Omit<Product, 'id'> & { id?: string }) => {
        const added = addStoredProduct(product);
        cachedProducts = loadStoredProducts();
        return added;
    }, []);

    const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
        const updated = updateStoredProduct(id, updates);
        cachedProducts = loadStoredProducts();
        return updated;
    }, []);

    const deleteProduct = useCallback((id: string) => {
        const remaining = deleteStoredProduct(id);
        cachedProducts = loadStoredProducts();
        return remaining;
    }, []);

    const duplicateProduct = useCallback((id: string) => {
        const duplicated = duplicateStoredProduct(id);
        cachedProducts = loadStoredProducts();
        return duplicated;
    }, []);

    const toggleStock = useCallback((id: string) => {
        const next = toggleStoredProductStock(id);
        cachedProducts = loadStoredProducts();
        return next;
    }, []);

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
