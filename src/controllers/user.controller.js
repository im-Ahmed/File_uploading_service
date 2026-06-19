import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import JWT from "jsonwebtoken";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, err.message || "failed to generate tokens");
  }
};
const registerUser = asyncHandler(async (req, res, _) => {
  const { username, email, password } = req.body;
  if (!username && !email && !password) {
    throw new ApiError(404, "User name or email is missing");
  }
  const userExist = await User.findOne({ $or: [({ username }, { email })] });
  if (userExist) {
    throw new ApiError(400, "User already exist");
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  if (!user) {
    throw new ApiError(500, "something wend wrong while registering user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User registered"));
});
const loginUser = asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(404, "fill all credentials!");
  }

  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new ApiError(404, "User does not exist");
  }
  const validPassword = await userExist.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(400, "incorrect password");
  }
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(userExist);
  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken",
  );
  if (!loggedInUser) {
    throw new ApiError(500, "something went wrong while logginn user");
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});
const logoutUser = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "Unauthorized User");
  }
  try {
    await User.findByIdAndUpdate(userId, {
      $unset: {
        refreshToken: 1,
      },
    });
    req.user = null;
  } catch (err) {
    throw new ApiError(404, "Unathuarized User");
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const deleteUser = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "Unauthorized User");
  }
  try {
    await User.findByIdAndDelete(userId);
    req.user = null;
  } catch (err) {
    throw new ApiError(
      500,
      err.message || "Something went wrong while deleting User",
    );
  }
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User deleted Successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res, _) => {
  const incommingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = JWT.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id);
    if (!user && user.refreshToken !== incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "User session refreshed successfully",
        ),
      );
  } catch (err) {
    throw new ApiError(404, err.message || "Invalid refresh token");
  }
});
const getCurrentUser = asyncHandler(async (req, res, _) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-refreshToken").lean();
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  refreshAccessToken,
  getCurrentUser,
};
