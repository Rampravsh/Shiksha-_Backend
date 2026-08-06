export interface LeaderboardEntry {
  rank: number;
  attemptId: string;
  userId: string;
  userFullName: string;
  userAvatarUrl?: string | null;
  stateName?: string | null;
  score: number;
  totalCorrect: number;
  totalIncorrect: number;
  timeTakenSecs: number;
  accuracy: number;
  percentile: number;
  submittedAt?: Date | null;
}

export interface LeaderboardQueryFilters {
  stateId?: string;
}
