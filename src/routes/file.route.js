import { Router } from "express";
import { uploadFile, deleteFile, getAllFiles } from "../controllers/file.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.use(verifyJWT);
router.route("/upload").post(upload.single("uploaded_file"), uploadFile);
router.route("/d/:deleteId").delete(deleteFile);
router.route("/").get(getAllFiles);
router.route("/:fileId").get(getAllFiles);
export default router;
