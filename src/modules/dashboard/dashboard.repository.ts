import { AttemptStatus } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { StudentDashboard, AdminDashboard } from "./dashboard.types";

export class DashboardRepository {
  async getStudentDashboard(userId: string): Promise<StudentDashboard> {
    const [
      totalAttempts,
      completedStats,
      recentAttempts,
      latestTestPapers,
      recentCA,
    ] = await Promise.all([
      prisma.testAttempt.count({ where: { userId } }),
      prisma.testAttempt.aggregate({
        where: { userId, status: AttemptStatus.COMPLETED },
        _count: { id: true },
        _avg: { score: true, accuracy: true },
        _max: { score: true },
      }),
      prisma.testAttempt.findMany({
        where: { userId, status: AttemptStatus.COMPLETED },
        take: 5,
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          score: true,
          accuracy: true,
          submittedAt: true,
          testPaper: { select: { title: true } },
        },
      }),
      prisma.testPaper.findMany({
        where: { isPublished: true },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          totalQuestions: true,
          durationMins: true,
        },
      }),
      prisma.currentAffair.findMany({
        where: { isPublished: true },
        take: 5,
        orderBy: { publishedAt: "desc" },
        select: { id: true, title: true, slug: true, publishedAt: true },
      }),
    ]);

    const totalCompleted = completedStats._count.id;
    const averageScore = completedStats._avg.score
      ? Math.round(completedStats._avg.score * 100) / 100
      : 0;
    const averageAccuracy = completedStats._avg.accuracy
      ? Math.round(completedStats._avg.accuracy * 100) / 100
      : 0;
    const bestScore = completedStats._max.score || 0;

    return {
      performance: {
        totalAttempts,
        totalCompleted,
        averageScore,
        averageAccuracy,
        bestScore,
      },
      recentAttempts: recentAttempts.map((a) => ({
        id: a.id,
        testPaperTitle: a.testPaper.title,
        score: a.score,
        accuracy: a.accuracy,
        submittedAt: a.submittedAt,
      })),
      latestTestPapers,
      recentCurrentAffairs: recentCA,
    };
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    const [
      totalUsers,
      totalExams,
      totalQuestions,
      totalTestPapers,
      totalAttempts,
      totalCurrentAffairs,
      totalNotifications,
      recentUsers,
      recentTestPapers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.exam.count(),
      prisma.question.count(),
      prisma.testPaper.count(),
      prisma.testAttempt.count(),
      prisma.currentAffair.count(),
      prisma.notification.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, email: true, createdAt: true },
      }),
      prisma.testPaper.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          isPublished: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      counts: {
        totalUsers,
        totalExams,
        totalQuestions,
        totalTestPapers,
        totalAttempts,
        totalCurrentAffairs,
        totalNotifications,
      },
      recentUsers,
      recentTestPapers,
    };
  }
}
