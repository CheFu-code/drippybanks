// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a precise type for the cache
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Augment Node's global type with our cache (no 'any')
declare global {
    var __mongooseCache: MongooseCache | undefined;
}

// Initialize or reuse the cache safely
const cached: MongooseCache =
    global.__mongooseCache ??
    (global.__mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI!, {
                bufferCommands: false,
                dbName: "drippybanks_db",
            })
            .then((m) => {
                console.log("MongoDB connected");
                return m;
            })
            .catch((err) => {
                cached.promise = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
