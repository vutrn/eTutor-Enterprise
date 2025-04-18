const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config(); // Load biến môi trường từ file .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
