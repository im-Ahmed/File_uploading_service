import JWT from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenvx from "@dotenvx/dotenvx";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
dotenvx.config();

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }
    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, `${err?.message}` || "Invalid access token");
  }
});
