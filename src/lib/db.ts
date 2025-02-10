import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/non-fare-il-secco';

if (!MONGODB_URI) {
  throw new Error('Definisci la variabile MONGODB_URI nel file .env.local');
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  let mongoose: MongooseConnection;
}

let cached = global.mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      cached.conn = mongoose;
      return mongoose;
    });
  }

  try {
    const mongoose = await cached.promise;
    cached.conn = mongoose;
    return mongoose;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;