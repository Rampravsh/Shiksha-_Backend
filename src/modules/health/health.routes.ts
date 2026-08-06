import { Router } from "express";
import { HealthRepository } from "./health.repository";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";
import { asyncHandler } from "../../core/async-handler";

const healthRepository = new HealthRepository();
const healthService = new HealthService(healthRepository);
const healthController = new HealthController(healthService);

const router = Router();

router.get("/", asyncHandler(healthController.getHealth));
router.get("/live", asyncHandler(healthController.getLive));
router.get("/ready", asyncHandler(healthController.getReady));
router.get("/database", asyncHandler(healthController.getDatabaseHealth));
router.get("/firebase", asyncHandler(healthController.getFirebaseHealth));
router.get("/cloudinary", asyncHandler(healthController.getCloudinaryHealth));
router.get("/system", asyncHandler(healthController.getSystemMetrics));

export const healthRouter = router;
