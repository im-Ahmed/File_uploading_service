import { Router } from "express";
import {
  deleteUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured routes
router.use(verifyJWT);
router.route("/logout").get(logoutUser);
router.route("/delete").delete(deleteUser);
router.route("/current-user").get(getCurrentUser);

export default router;
