import dotenv from "dotenv";

// Load env
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";

// console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Secret:", process.env.CLOUDINARY_API_SECRET);

// Correct Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});