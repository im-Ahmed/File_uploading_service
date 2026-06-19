import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";

const deleteFromCloudinary = async (URI) => {
  try {
    if (!URI) {
      throw new ApiError(500, "old file is missing");
    }

    const VIDEO_EXTENSIONS = /\.(mp4|avi|mov|mkv|webm|flv|wmv|m4v|3gp)$/i;
    const RAW_EXTENSIONS =
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|7z|tar|gz|mp3|wav|aac|ogg)$/i;

    let resourceType = "image"; // default
    let publicId = URI.substring(
      URI.lastIndexOf("/") + 1,
      URI.lastIndexOf("."),
    );
    if (URI.match(VIDEO_EXTENSIONS)) {
      resourceType = "video";
    } else if (URI.match(RAW_EXTENSIONS)) {
      resourceType = "raw";
      publicId = URI.substring(URI.lastIndexOf("/") + 1, URI.length);
    }

    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    if (res.result !== "ok") {
      throw new ApiError(500, `failed while deleting file: ${res.result}`);
    }
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "something went wrong while removing previous file from cloudinary",
    );
  }
};
export { deleteFromCloudinary };
