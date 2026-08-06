import { Router } from "express";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryQuery,
  validateCategoryIdParam,
} from "./categories.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";
import { asyncHandler } from "../../core/async-handler";

const categoriesRepository = new CategoriesRepository();
const categoriesService = new CategoriesService(categoriesRepository);
const categoriesController = new CategoriesController(categoriesService);

const router = Router();

router.get(
  "/",
  validateCategoryQuery,
  asyncHandler(categoriesController.getAllCategories),
);
router.get(
  "/:id",
  validateCategoryIdParam,
  asyncHandler(categoriesController.getCategoryById),
);

// Admin-protected mutation routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateCategory,
  asyncHandler(categoriesController.createCategory),
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateCategory,
  asyncHandler(categoriesController.updateCategory),
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateCategoryIdParam,
  asyncHandler(categoriesController.deleteCategory),
);

export const categoriesRouter = router;
