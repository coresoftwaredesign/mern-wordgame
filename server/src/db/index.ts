import mongoose from "mongoose";

export function connectDatabase() {
  const connectionString: string = process.env.MONGO_URI || "";

  mongoose.connect(connectionString).catch((e) => {
    console.error("Connection error", e.message);
  });

  const db = mongoose.connection;
  return db;
}

export function closeDatabase() {
  mongoose.connection.close();
}
