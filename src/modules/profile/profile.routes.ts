import { Router } from "express";
import { ProfileRepository } from "./profile.repository";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { validateUpdateProfile } from "./profile.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../core/async-handler";

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

const router = Router();

router.get("/", authMiddleware, asyncHandler(profileController.getProfile));
router.patch(
  "/",
  authMiddleware,
  validateUpdateProfile,
  asyncHandler(profileController.updateProfile),
);
router.delete(
  "/avatar",
  authMiddleware,
  asyncHandler(profileController.removeAvatar),
);
router.get(
  "/statistics",
  authMiddleware,
  asyncHandler(profileController.getStatistics),
);

export const profileRouter = router;
