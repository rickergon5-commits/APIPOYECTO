import { config } from "dotenv";
config();

export const BD_HOST = process.env.BD_HOST || "btgrojyfdixuk4adsuyg-mysql.services.clever-cloud.com";
export const BD_DATABASE = process.env.BD_DATABASE || "btgrojyfdixuk4adsuyg";
export const BD_USER = process.env.BD_USER || "utcukuiktbncwjxb";
export const BD_PASSWORD = process.env.BD_PASSWORD || "wM8W8pzAc8ZL8cDe0fKU";
export const BD_PORT = process.env.BD_PORT || 3306;

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || "CLAVEapi1";
export const JWT_EXPIRES = process.env.JWT_EXPIRES || "2h";

export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;