import type { Product } from "@/context/CartContext";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/app/shop/products";

export const PRODUCT_STORAGE_KEY = "drippybanks_admin_products";
export const PRODUCTS_UPDATED_EVENT = "drippybanks:products-updated";

export const PRODUCT_CATEGORIES = [
    "Tops",
    "Hoodies",
    "Caps",
    "Bags",
    "Pants",
    "Sets",
    "Jackets",
    "Accessories",
] as const;

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
export const ACCESSORY_SIZES = ["One Size"] as const;

export const PRODUCT_BADGES = [
    "New Drop",
    "Bestseller",
    "Limited Edition",
    "🏷️ On Sale",
    "Staff Pick",
    "Exclusive",
] as const;

/**
 * Normalizes a raw product object ensuring all optional fields have proper defaults
 */
export function normalizeProduct(raw: Partial<Product>, index = 0): Product {
    const isCapOrBag = raw.category === "Caps" || raw.category === "Bags" || raw.category === "Accessories";
    const defaultSizes = isCapOrBag ? ["One Size"] : ["S", "M", "L", "XL"];

    return {
        id: String(raw.id || `db_${Date.now()}_${index}`),
        name: raw.name?.trim() || "Untitled...",
        price: typeof raw.price === "number" && raw.price >= 0 ? raw.price : 400,
        originalPrice: typeof raw.originalPrice === "number" ? raw.originalPrice : undefined,
        category: raw.category?.trim() || "Tops",
        image: raw.image?.trim() || "/placeholder.png",
        sizes: Array.isArray(raw.sizes) && raw.sizes.length > 0 ? raw.sizes : defaultSizes,
        selectedSize: raw.selectedSize,
        colors: Array.isArray(raw.colors) && raw.colors.length > 0 ? raw.colors : ["Midnight Black"],
        badge: raw.badge ?? (index < 3 ? "New Drop" : undefined),
        description: raw.description?.trim() || "Premium heavyweight cotton streetwear garment with signature Drippy Banks tailored fit and high-density detailing.",
        fit: raw.fit?.trim() || (isCapOrBag ? "Adjustable fit" : "Boxy oversized streetwear fit"),
        inStock: raw.inStock !== false,
        stock: typeof raw.stock === "number" ? raw.stock : 45,
        featured: raw.featured ?? (index < 4),
        createdAt: raw.createdAt || new Date(Date.now() - index * 86400000).toISOString(),
    };
}

export const BASE_SEED_PRODUCTS: Product[] = [];

/**
 * Loads stored products from localStorage with automatic migration and normalization
 */
export function loadStoredProducts(): Product[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.map((item, idx) => normalizeProduct(item, idx));
        }

        return [];
    } catch {
        return [];
    }
}

/**
 * Saves products to localStorage and broadcasts the update across open windows/components
 */
export function saveStoredProducts(products: Product[]): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: products }));
    } catch (err) {
        console.error("[product-store] Failed to save products to localStorage:", err);
    }
}

/**
 * Synchronizes products fetched from CheFu Backend into the local store
 */
export function syncProductsFromBackend(products: Product[]): Product[] {
    if (!Array.isArray(products)) {
        return loadStoredProducts();
    }
    const normalized = products.map((item, idx) => normalizeProduct(item, idx));
    saveStoredProducts(normalized);
    return normalized;
}

/**
 * Adds a new product to the beginning of the inventory
 */
export function addStoredProduct(product: Omit<Product, "id"> & { id?: string }): Product {
    const products = loadStoredProducts();
    
    // Generate clean unique ID
    const maxNumId = Math.max(0, ...products.map((p) => Number(p.id) || 0));
    const nextId = product.id && product.id.trim().length > 0 ? product.id.trim() : String(maxNumId + 1);

    const newProduct = normalizeProduct({
        ...product,
        id: nextId,
        createdAt: new Date().toISOString(),
    });

    const nextProducts = [newProduct, ...products];
    saveStoredProducts(nextProducts);
    return newProduct;
}

/**
 * Updates an existing product by ID
 */
export function updateStoredProduct(id: string, updates: Partial<Product>): Product[] {
    const products = loadStoredProducts();
    const nextProducts = products.map((item) => {
        if (item.id === id) {
            return normalizeProduct({ ...item, ...updates, id });
        }
        return item;
    });

    saveStoredProducts(nextProducts);
    return nextProducts;
}

/**
 * Deletes a product by ID
 */
export function deleteStoredProduct(id: string): Product[] {
    const products = loadStoredProducts();
    const nextProducts = products.filter((item) => item.id !== id);
    saveStoredProducts(nextProducts);
    return nextProducts;
}

/**
 * Duplicates a product for rapid variant creation
 */
export function duplicateStoredProduct(id: string): Product | null {
    const products = loadStoredProducts();
    const target = products.find((p) => p.id === id);
    if (!target) return null;

    const maxNumId = Math.max(0, ...products.map((p) => Number(p.id) || 0));
    const nextId = String(maxNumId + 1);

    const duplicated: Product = {
        ...target,
        id: nextId,
        name: `${target.name} (Copy)`,
        createdAt: new Date().toISOString(),
    };

    const nextProducts = [duplicated, ...products];
    saveStoredProducts(nextProducts);
    return duplicated;
}

/**
 * Toggles the inStock flag of a product
 */
export function toggleStoredProductStock(id: string): Product[] {
    const products = loadStoredProducts();
    const nextProducts = products.map((item) => {
        if (item.id === id) {
            return { ...item, inStock: !item.inStock };
        }
        return item;
    });

    saveStoredProducts(nextProducts);
    return nextProducts;
}

/**
 * Resets inventory back to the curated default collection
 */
export function resetStoredProductsToDefault(): Product[] {
    saveStoredProducts(BASE_SEED_PRODUCTS);
    return BASE_SEED_PRODUCTS;
}

/**
 * Exports the current catalog as a formatted JSON string
 */
export function exportProductsToJson(): string {
    const products = loadStoredProducts();
    return JSON.stringify(products, null, 2);
}

/**
 * Imports products from a JSON string with schema validation
 */
export function importProductsFromJson(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return { success: false, count: 0, error: "Invalid JSON structure: Expected an array of products." };
        }

        const validProducts = parsed.map((item, idx) => normalizeProduct(item, idx));
        saveStoredProducts(validProducts);
        return { success: true, count: validProducts.length };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse JSON file.";
        return { success: false, count: 0, error: message };
    }
}
