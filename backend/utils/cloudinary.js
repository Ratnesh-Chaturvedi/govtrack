import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export const uploadImageBuffer = (buffer, folder) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'image' },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }
  );
  stream.end(buffer);
});

export const uploadVideoBuffer = (buffer, folder) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'video' },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }
  );
  stream.end(buffer);
});
