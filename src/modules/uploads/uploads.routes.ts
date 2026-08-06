import { Router } from "express";
import { UploadsRepository } from "./uploads.repository";
import { UploadsService } from "./uploads.service";
import { UploadsController } from "./uploads.controller";
import {
  validateUploadQuery,
  validateUploadIdParam,
} from "./uploads.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";
import { asyncHandler } from "../../core/async-handler";

const uploadsRepository = new UploadsRepository();
const uploadsService = new UploadsService(uploadsRepository);
const uploadsController = new UploadsController(uploadsService);

const router = Router();

// Upload image file (Authenticated users)
router.post(
  "/image",
  authMiddleware,
  uploadMiddleware.single("file"),
  asyncHandler(uploadsController.uploadFile),
);

// Admin-protected upload management routes
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  validateUploadQuery,
  asyncHandler(uploadsController.getAllUploads),
);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUploadIdParam,
  asyncHandler(uploadsController.getUploadById),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUploadIdParam,
  asyncHandler(uploadsController.deleteUpload),
);

export const uploadsRouter = router;
