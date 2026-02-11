"use server";

import { adminCreateProductSchema } from "@/validators/productSchema";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/models/Product";

export async function addProductAction(formData: unknown) {
  try {
    const data = adminCreateProductSchema.parse(formData);
    await connectDB();

    let imageUrl = "";

    // Check if an actual File is provided
    if (
      data.imageUrl &&
      typeof data.imageUrl === "object" &&
      "arrayBuffer" in data.imageUrl
    ) {
      const buffer = Buffer.from(await data.imageUrl.arrayBuffer());
      imageUrl = `data:${data.imageUrl.type};base64,${buffer.toString("base64")}`;
    } else if (typeof data.imageUrl === "string") {
      imageUrl = data.imageUrl;
    }

    await ProductModel.create({
      slug: data.slug,
      title: data.title,
      brand: data.brand,
      description: data.description,
      category: {
        id: data.categorySlug,
        name: data.categoryName,
        slug: data.categorySlug,
      },
      tags: [],
      images: [{ url: imageUrl, position: 0 }],
      variants: [
        {
          sku: `${data.slug}-${data.size || "default"}`,
          size: data.size,
          color: data.color,
          priceCents: data.priceCents,
          stock: data.stock,
          isDefault: true,
        },
      ],
    });

    return { success: true };
  } catch (err: unknown) {
    let message = "Something went wrong";
    if (err instanceof Error) message = err.message;
    return { success: false, error: message };
  }
}
