import mongoose from 'mongoose';

// Listen to connection errors to prevent unhandled EventEmitter exceptions from terminating the process
mongoose.connection.on('error', (err) => {
  console.warn(`⚠️ MongoDB Connection Error: ${err.message}. Operating in JSON fallback mode.`);
});

let connectionAttempt;

export function isDatabaseConfigured() {
  const uri = process.env.MONGO_URI;
  return Boolean(uri && !/<db_username>|<db_password>|REPLACE_WITH|YOUR_[A-Z0-9_]+|@cluster0\.mongodb\.net(?:[/:?]|$)/i.test(uri));
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return true;
  if (connectionAttempt) return connectionAttempt;
  const uri = process.env.MONGO_URI;
  const hasTemplateValues = /<db_username>|<db_password>|REPLACE_WITH|YOUR_[A-Z0-9_]+/i.test(uri || '');
  const hasExampleAtlasHost = /@cluster0\.mongodb\.net(?:[/:?]|$)/i.test(uri || '');
  if (!uri || hasTemplateValues || hasExampleAtlasHost) {
    console.warn('MongoDB is unavailable: set MONGO_URI to the connection string copied from your Atlas cluster, not the sample cluster0.mongodb.net host.');
    return false;
  }

  connectionAttempt = (async () => {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ MongoDB Connection could not be established: ${error.message}. Operating in JSON fallback mode.`);
      return false;
    }
  })();
  try { return await connectionAttempt; }
  finally { connectionAttempt = undefined; }
}

export async function ensureDBConnected() {
  if (mongoose.connection.readyState === 1) return true;
  if (mongoose.connection.readyState === 2) {
    try {
      await mongoose.connection.asPromise();
      return mongoose.connection.readyState === 1;
    } catch {
      return false;
    }
  }
  return connectDB();
}
