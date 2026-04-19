import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

async function clearCategories() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shopverse");
  await Category.deleteMany({});
  console.log("✅ All categories deleted.");
  process.exit(0);
}

clearCategories().catch(err => { console.error(err); process.exit(1); });
