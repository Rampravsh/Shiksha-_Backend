import { Router } from "express";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import {
  validateUpdateProfile,
  validateUserQuery,
  validateUserIdParam,
} from "./users.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { asyncHandler } from "../../core/async-handler";

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

const router = Router();

// Protected Profile routes
router.get(
  "/profile",
  authMiddleware,
  asyncHandler(usersController.getProfile),
);
router.patch(
  "/profile",
  authMiddleware,
  validateUpdateProfile,
  asyncHandler(usersController.updateProfile),
);
router.post(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  asyncHandler(usersController.updateAvatar),
);

// Admin User Management routes
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  validateUserQuery,
  asyncHandler(usersController.getAllUsers),
);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUserIdParam,
  asyncHandler(usersController.getUserById),
);
router.patch(
  "/:id/activate",
  authMiddleware,
  adminMiddleware,
  validateUserIdParam,
  asyncHandler(usersController.activateUser),
);
router.patch(
  "/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  validateUserIdParam,
  asyncHandler(usersController.deactivateUser),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUserIdParam,
  asyncHandler(usersController.deleteUser),
);

export const usersRouter = router;
