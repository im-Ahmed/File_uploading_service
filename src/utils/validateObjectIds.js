import { ApiError } from "./ApiError.js";

export const ValidateId = (ID) => {
  if (!ID) throw new ApiError(401, "Id is missing");
  if (typeof ID !== "string" || ID.length !== 24) {
    throw new ApiError(401, "Invalid ID format");
  }
};
