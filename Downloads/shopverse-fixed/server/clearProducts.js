import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

async function clearProducts() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shopverse");
  await Product.deleteMany({});
  console.log("✅ All products deleted.");
  process.exit(0);
}

clearProducts().catch(err => { console.error(err); process.exit(1); });
