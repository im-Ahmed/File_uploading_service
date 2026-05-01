import mongoose from "mongoose";
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();
export const connectDB = async () => {
  try {
    const conn_instanse = await mongoose.connect(
      `${process.env.DB_URL}${process.env.DB_name}`,
    );
    console.log("Connection_Host", conn_instanse.connection.host);
  } catch (err) {
    console.log("DB connection failed" || err);
  }
};
