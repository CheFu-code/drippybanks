import type { Product } from "@/context/CartContext";
import { PRODUCTS } from "@/app/shop/products";

const STORAGE_KEY = "drippybanks_admin_products";

export function loadStoredProducts(): Product[] {
    if (typeof window === "undefined") {
        return PRODUCTS;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return PRODUCTS;
        }

        const parsed = JSON.parse(raw) as Product[];
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRODUCTS;
    } catch {
        return PRODUCTS;
    }
}

export function saveStoredProducts(products: Product[]) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
