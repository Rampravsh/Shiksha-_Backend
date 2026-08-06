import { Router } from "express";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateFirebaseLogin, validateRefreshToken } from "./auth.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router = Router();

// Public Firebase Authentication routes
router.post(
  "/firebase-login",
  validateFirebaseLogin,
  asyncHandler(authController.firebaseLogin),
);
router.post(
  "/refresh",
  validateRefreshToken,
  asyncHandler(authController.refresh),
);
router.post("/logout", asyncHandler(authController.logout));

// Protected User Session routes
router.post(
  "/logout-all",
  authMiddleware,
  asyncHandler(authController.logoutAll),
);
router.get("/me", authMiddleware, asyncHandler(authController.getCurrentUser));
router.delete(
  "/account",
  authMiddleware,
  asyncHandler(authController.deleteAccount),
);

// Admin User Status Control routes
router.patch(
  "/admin/users/:id/disable",
  authMiddleware,
  adminMiddleware,
  asyncHandler(authController.adminDisableUser),
);
router.patch(
  "/admin/users/:id/enable",
  authMiddleware,
  adminMiddleware,
  asyncHandler(authController.adminEnableUser),
);

export const authRouter = router;
