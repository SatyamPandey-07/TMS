import mongoose, { Connection } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in your environment variables");
}

// Extend globalThis to avoid using `var`
declare global {
  interface Global {
    _mongoose?: {
      conn: Connection | null;
      promise: Promise<Connection> | null;
    };
  }
}

// Type-safe way to use global state
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongoose?: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

const cached = globalWithMongoose._mongoose;

export async function connectDb(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
      maxPoolSize: 10,
    }).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.log(err, "MONGODB");
    
    cached.promise = null;
    throw new Error("MongoDB connection failed");
  }

  return cached.conn;
}