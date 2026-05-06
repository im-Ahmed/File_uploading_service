import { File } from "../models/file.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ValidateId } from "../utils/validateObjectIds.js";
import { cloudinarUploader } from "../utils/cloudinaryUploader.js";
import fs from "fs";
import { deleteFromCloudinary } from "../utils/cloudinaryRemover.js";

const uploadFile = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  const { filename } = req.body;
  const file = req.file;
  if (!filename || !file) {
    throw new ApiError(401, "File or file title is missing");
  }
  const fileExist = await File.findOne({ filename }).lean();
  if (fileExist) {
    fs.unlinkSync(file.path);
    throw new ApiError(401, "File already exist");
  }
  const cloudinary_response = await cloudinarUploader(file.path);
  if (!cloudinary_response?.secure_url) {
    throw new ApiError(500, "Something went wrong while uploading file");
  }
  const filePosted = await File.create({
    filename,
    owner: userId,
    url: cloudinary_response?.secure_url,
  });
  if (!filePosted) {
    throw new ApiError(500, "failed to save file");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { file: filePosted }, "File uploaded successfully"),
    );
});
const deleteFile = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  const { deleteId } = req.params;
  ValidateId(deleteId);
  const file = await File.findById(deleteId);
  if (!file) {
    throw new ApiError(401, "File does not exist");
  }
  try {
    await File.findOneAndDelete({
      _id: deleteId,
      owner: userId,
    });
    await deleteFromCloudinary(file.url);
  } catch (err) {
    throw new ApiError(500, err.message || "Failed to delete a file");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File deleted successfully"));
});
const getAllFiles = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  const allFiles = await File.find({
    owner: userId,
  });
  if (!allFiles || allFiles.lenght <= 0) {
    throw new ApiError(500, "something went wrong while fetching files");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { allFiles }, "Files fetched successfully"));
});
const fileById = asyncHandler(async (req, res, _) => {
  const { fileId } = req.params;
  ValidateId(fileId);
  const file = await File.findById(fileId);
  if (!file) {
    throw new ApiError(400, "File not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { file }, "File fetched successfully"));
});
export { uploadFile, deleteFile, getAllFiles, fileById };
