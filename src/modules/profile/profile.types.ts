export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  stateId?: string;
}

export interface ProfileStatistics {
  totalAttempts: number;
  totalCompleted: number;
  averageScore: number;
  averageAccuracy: number;
  totalTimeSecs: number;
  bestScore: number;
}
