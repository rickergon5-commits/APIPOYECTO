import { config } from "dotenv";
config();

export const BD_HOST = process.env.BD_HOST || "bdnuv02isy3tmu7buqc4-mysql.services.clever-cloud.com";
export const BD_DATABASE = process.env.BD_DATABASE || "bdnuv02isy3tmu7buqc4";
export const BD_USER = process.env.BD_USER || "u6rc0qi0c9melvxs";
export const BD_PASSWORD = process.env.BD_PASSWORD || "I8bqKKdDvm3VKxHO0i9J";
export const BD_PORT = process.env.BD_PORT || 3306;

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || "CLAVEapi1";
export const JWT_EXPIRES = process.env.JWT_EXPIRES || "2h";

//export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;