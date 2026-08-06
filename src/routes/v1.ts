import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { usersRouter } from "../modules/users/users.routes";
import { statesRouter } from "../modules/states/states.routes";
import { categoriesRouter } from "../modules/categories/categories.routes";
import { examCategoriesRouter } from "../modules/exam-categories/exam-categories.routes";
import { examsRouter } from "../modules/exams/exams.routes";
import { subjectsRouter } from "../modules/subjects/subjects.routes";
import { topicsRouter } from "../modules/topics/topics.routes";
import { questionsRouter } from "../modules/questions/questions.routes";
import { uploadsRouter } from "../modules/uploads/uploads.routes";
import { testPapersRouter } from "../modules/test-papers/test-papers.routes";
import { testQuestionsRouter } from "../modules/test-questions/test-questions.routes";
import { testAttemptsRouter } from "../modules/test-attempts/test-attempts.routes";
import { attemptAnswersRouter } from "../modules/attempt-answers/attempt-answers.routes";
import { leaderboardsRouter } from "../modules/leaderboards/leaderboards.routes";
import { profileRouter } from "../modules/profile/profile.routes";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes";
import { currentAffairsRouter } from "../modules/current-affairs/current-affairs.routes";
import { notificationsRouter } from "../modules/notifications/notifications.routes";
import { healthRouter } from "../modules/health/health.routes";

const router = Router();

// Primary Module Routers
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/profile", profileRouter);
router.use("/dashboard", dashboardRouter);
router.use("/states", statesRouter);
router.use("/categories", categoriesRouter);
router.use("/exam-categories", examCategoriesRouter);
router.use("/exams", examsRouter);
router.use("/subjects", subjectsRouter);
router.use("/topics", topicsRouter);
router.use("/questions", questionsRouter);
router.use("/uploads", uploadsRouter);
router.use("/test-papers", testPapersRouter);
router.use("/test-papers/:testPaperId/questions", testQuestionsRouter);
router.use("/attempts", testAttemptsRouter);
router.use("/attempts/:attemptId/answers", attemptAnswersRouter);
router.use("/leaderboards", leaderboardsRouter);
router.use("/current-affairs", currentAffairsRouter);
router.use("/notifications", notificationsRouter);
router.use("/health", healthRouter);

export const v1Router = router;
