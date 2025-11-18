// src/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

// Opción buena: usar variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
