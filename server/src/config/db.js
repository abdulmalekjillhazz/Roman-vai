import mongoose from 'mongoose';

// Listen to connection errors to prevent unhandled EventEmitter exceptions from terminating the process
mongoose.connection.on('error', (err) => {
  console.warn(`⚠️ MongoDB Connection Error: ${err.message}. Operating in JSON fallback mode.`);
});

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('cluster0.mongodb.net')) {
    console.warn('ℹ️ Running in JSON fallback mode (MONGO_URI is unconfigured or a placeholder).');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection could not be established: ${error.message}. Operating in JSON fallback mode.`);
    return false;
  }
}
