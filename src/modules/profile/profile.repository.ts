import { User, AttemptStatus } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { UpdateProfileInput, ProfileStatistics } from "./profile.types";
import { UsersRepository } from "../users/users.repository";

export class ProfileRepository {
  private readonly usersRepository = new UsersRepository();

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async updateProfile(id: string, data: UpdateProfileInput): Promise<User> {
    return this.usersRepository.updateProfile(id, {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    });
  }

  async removeAvatar(id: string): Promise<User> {
    return this.usersRepository.updateAvatar(id, null);
  }

  async getStatistics(userId: string): Promise<ProfileStatistics> {
    const [totalAttempts, completedStats] = await Promise.all([
      prisma.testAttempt.count({ where: { userId } }),
      prisma.testAttempt.aggregate({
        where: { userId, status: AttemptStatus.COMPLETED },
        _count: { id: true },
        _avg: { score: true, accuracy: true },
        _sum: { timeTakenSecs: true },
        _max: { score: true },
      }),
    ]);

    const totalCompleted = completedStats._count.id;
    const averageScore = completedStats._avg.score
      ? Math.round(completedStats._avg.score * 100) / 100
      : 0;
    const averageAccuracy = completedStats._avg.accuracy
      ? Math.round(completedStats._avg.accuracy * 100) / 100
      : 0;
    const totalTimeSecs = completedStats._sum.timeTakenSecs || 0;
    const bestScore = completedStats._max.score || 0;

    return {
      totalAttempts,
      totalCompleted,
      averageScore,
      averageAccuracy,
      totalTimeSecs,
      bestScore,
    };
  }
}
