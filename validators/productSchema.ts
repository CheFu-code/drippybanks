import { z } from "zod";

export const adminCreateProductSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    brand: z.string().optional(),
    description: z.string().optional(),
    categoryName: z.string().min(1, "Category required"),
    categorySlug: z.string().min(1, "Category slug required"),
    priceCents: z.coerce.number().int().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative(),
    size: z.string().optional(),
    color: z.string().optional(),
    imageUrl: z.union([
        z.string().url("Must be a valid URL"),
        z
            .any() // Could be a browser File
            .refine(
                (f) => f && typeof f.arrayBuffer === "function",
                "Must be a file-like object",
            ),
    ]),
});

export type AdminCreateProductInput = z.infer<typeof adminCreateProductSchema>;
