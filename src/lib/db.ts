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
      serverSelectionTimeoutMS: 5000, // Timeout dopo 5 secondi
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connesso al database MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('Errore di connessione al database:', error);
      throw error;
    });
  }

  try {
    const mongoose = await cached.promise;
    cached.conn = mongoose;
    return mongoose;
  } catch (e) {
    cached.promise = null;
    console.error('Errore durante la connessione al database:', e);
    throw e;
  }
}

export default dbConnect;