import { Router } from "express";
import { uploadFile } from "../controllers/file.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("uploaded_file"), uploadFile);
export default router;
