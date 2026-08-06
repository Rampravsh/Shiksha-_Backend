import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { cloudinaryConfig } from "../config/cloudinary";
import { logger } from "../core/logger";

export const initializeCloudinary = (): typeof cloudinary | null => {
  if (!cloudinaryConfig.isConfigured) {
    logger.warn(
      "Cloudinary configuration incomplete. Skipping initialization.",
    );
    return null;
  }

  try {
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
      secure: true,
    });
    logger.info("☁️ Cloudinary SDK initialized successfully");
    return cloudinary;
  } catch (error) {
    logger.error({ error }, "Failed to initialize Cloudinary SDK");
    return null;
  }
};

/**
 * Upload buffer stream to Cloudinary folder
 */
export const uploadImageBuffer = (
  buffer: Buffer,
  folder = "shiksha/avatars",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    initializeCloudinary();
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          logger.error({ error }, "Cloudinary buffer upload failed");
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete asset from Cloudinary by publicId
 */
export const deleteCloudinaryAsset = async (
  publicId: string,
): Promise<boolean> => {
  try {
    initializeCloudinary();
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    logger.error({ error, publicId }, "Failed to delete Cloudinary asset");
    return false;
  }
};
