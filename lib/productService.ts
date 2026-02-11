import { ProductModel } from "@/models/Product";
import "server-only";
import { connectDB } from "./mongodb";

import type { ProductDocument } from "@/models/Product";
import type { SortOrder } from "mongoose";

export async function getProducts({
    page = 1,
    limit = 20,
    category,
    q,
    sort = "new",
}: {
    page?: number;
    limit?: number;
    category?: string;
    q?: string;
    sort?: "new" | "price_asc" | "price_desc";
}) {
    await connectDB();

    const skip = (page - 1) * limit;

    // Typed filter
    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
        filter["category.slug"] = category;
    }

    if (q) {
        filter.$text = { $search: q };
    }

    // Typed sort object
    const sortObj: Record<string, SortOrder> =
        sort === "price_asc"
            ? { "variants.priceCents": 1 }
            : sort === "price_desc"
                ? { "variants.priceCents": -1 }
                : { createdAt: -1 };

    const [items, total] = await Promise.all([
        ProductModel.find(filter).sort(sortObj).skip(skip).limit(limit),
        ProductModel.countDocuments(filter),
    ]);

    return {
        page,
        limit,
        total,
        items,
    };
}

export async function createProduct(data: Partial<ProductDocument>) {
    await connectDB();
    return ProductModel.create(data);
}

export async function getProductBySlug(slug: string) {
    await connectDB();
    return ProductModel.findOne({ slug }).lean<ProductDocument | null>();
}
