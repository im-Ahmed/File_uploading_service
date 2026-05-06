import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";

const cloudinarUploader = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the Image
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // Image uploaded successfully
    fs.unlinkSync(localFilePath); // remove the image from our server
    return response;
  } catch (error) {
    // Remove the temporarilly save file if the image upload got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { cloudinarUploader };
