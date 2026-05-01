import { ApiError } from "./ApiError.js";

export const ValidateId = (ID) => {
  // Skip validation if the ID is not provided
  if (!ID) return;

  // Validate only when ID exists
  if (typeof ID !== "string" || ID.length !== 24) {
    throw new ApiError(400, "Invalid ID format");
  }
};
