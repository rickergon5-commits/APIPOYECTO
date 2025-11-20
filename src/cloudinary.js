import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: 'dvc384ydg',                 
  api_key: '484885771644552',              
  api_secret: 'HWjaWAe4Zd2lDB7D2hWIKFlDvH0',            
  secure: true
});

export default cloudinary;
