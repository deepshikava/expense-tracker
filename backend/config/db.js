import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!globalThis.__mongooseCache) {
  globalThis.__mongooseCache = { conn: null, promise: null };
}

const cache = globalThis.__mongooseCache;

/**
 * Serverless-safe MongoDB connection (cached on globalThis).
 * Must be awaited before any Mongoose queries on Vercel.
 */
export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    cache.conn = null;
    throw err;
  }
}
