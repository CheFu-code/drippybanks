import mongoose, { InferSchemaType, Schema, Types, models } from "mongoose";

type VariantDocument = InferSchemaType<typeof VariantSchema>;

// ----- Variant Schema -----
const VariantSchema = new Schema(
    {
        sku: { type: String, required: true, unique: true },
        color: String,
        size: String,
        priceCents: { type: Number, required: true }, // safe money
        currency: { type: String, default: "USD" },
        stock: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
    },
    { _id: false },
);

// ----- Image Schema -----
const ImageSchema = new Schema(
    {
        url: { type: String, required: true },
        alt: String,
        position: { type: Number, default: 0 },
    },
    { _id: false },
);

// ----- Category (embedded for speed) -----
const CategorySchema = new Schema(
    {
        id: { type: String },
        name: { type: String },
        slug: { type: String },
    },
    { _id: false },
);

// ----- Main Product Schema -----
const ProductSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true, index: true },
        title: { type: String, required: true, index: true },
        description: String,
        brand: String,
        category: CategorySchema,
        tags: [String],
        images: [ImageSchema],
        variants: {
            type: [VariantSchema],
            validate: (v: Types.DocumentArray<VariantDocument>) => v.length > 0, // must have at least one variant
        },
        rating: Number,
        totalReviews: { type: Number, default: 0 },
    },
    { timestamps: true },
);

// Important optimization indexes
ProductSchema.index({ title: "text", brand: "text", tags: "text" });

export const ProductModel =
    models.Product || mongoose.model("Product", ProductSchema);
export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;
