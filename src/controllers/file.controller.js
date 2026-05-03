import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadFile = asyncHandler(async (req, res, _) => {
  const { fileName } = req.body;
  const file = req.file;

  



  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { },
        "File uploaded successfully",
      ),
    );
});
export { uploadFile };
