import { ProductModel } from "@/models/Product";
import { InferSchemaType } from "mongoose";

export type Product = InferSchemaType<typeof ProductModel.schema>;
