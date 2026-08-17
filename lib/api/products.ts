import { apiUrl } from "@/config/chefuAuth";
import type { Product } from "@/context/CartContext";

export interface CreateProductPayload {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  sizes?: string[];
  colors?: string[];
  badge?: string;
  description?: string;
  fit?: string;
  inStock?: boolean;
  stock?: number;
  featured?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  badge?: string;
  description?: string;
  fit?: string;
  inStock?: boolean;
  stock?: number;
  featured?: boolean;
}

export interface UploadImageResponse {
  url: string;
  path: string;
}

/**
 * Converts a browser File object to a base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch all products from CHEFU Backend
 */
export async function fetchProductsApi(): Promise<Product[]> {
  const res = await fetch(apiUrl("/drippybanks/products"), {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to fetch products (${res.status})`);
  }

  const data = await res.json();
  return Array.isArray(data?.products) ? data.products : [];
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductByIdApi(id: string): Promise<Product> {
  const res = await fetch(apiUrl(`/drippybanks/products/${encodeURIComponent(id)}`), {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to fetch product ${id}`);
  }

  return res.json();
}

/**
 * Upload an image file to Firebase Storage via CHEFU Backend
 */
export async function uploadProductImageApi(
  fileOrBase64: File | string,
  contentType?: string,
): Promise<UploadImageResponse> {
  let imageBase64: string;
  let resolvedContentType = contentType;

  if (typeof fileOrBase64 === "string") {
    imageBase64 = fileOrBase64;
  } else {
    resolvedContentType = fileOrBase64.type || "image/jpeg";
    imageBase64 = await fileToBase64(fileOrBase64);
  }

  const res = await fetch(apiUrl("/drippybanks/upload-image"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      imageBase64,
      contentType: resolvedContentType,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to upload image (${res.status})`,
    );
  }

  return res.json();
}

/**
 * Create a new product in CHEFU Backend (Admin only)
 */
export async function createProductApi(
  payload: CreateProductPayload,
): Promise<Product> {
  const res = await fetch(apiUrl("/drippybanks/products"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to create product (${res.status})`,
    );
  }

  return res.json();
}

/**
 * Update an existing product (Admin only)
 */
export async function updateProductApi(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const res = await fetch(apiUrl(`/drippybanks/products/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to update product (${res.status})`,
    );
  }

  return res.json();
}

/**
 * Delete a product (Admin only)
 */
export async function deleteProductApi(
  id: string,
): Promise<{ success: boolean; id: string }> {
  const res = await fetch(apiUrl(`/drippybanks/products/${encodeURIComponent(id)}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to delete product (${res.status})`,
    );
  }

  return res.json();
}

/**
 * Toggle stock status for a product (Admin only)
 */
export async function toggleProductStockApi(id: string): Promise<Product> {
  const res = await fetch(
    apiUrl(`/drippybanks/products/${encodeURIComponent(id)}/toggle-stock`),
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `Failed to toggle stock status (${res.status})`,
    );
  }

  return res.json();
}
