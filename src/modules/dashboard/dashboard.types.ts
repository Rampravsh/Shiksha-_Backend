export interface StudentDashboard {
  performance: {
    totalAttempts: number;
    totalCompleted: number;
    averageScore: number;
    averageAccuracy: number;
    bestScore: number;
  };
  recentAttempts: {
    id: string;
    testPaperTitle: string;
    score: number;
    accuracy: number;
    submittedAt: Date | null;
  }[];
  latestTestPapers: {
    id: string;
    title: string;
    slug: string;
    totalQuestions: number;
    durationMins: number;
  }[];
  recentCurrentAffairs: {
    id: string;
    title: string;
    slug: string;
    publishedAt: Date | null;
  }[];
}

export interface AdminDashboard {
  counts: {
    totalUsers: number;
    totalExams: number;
    totalQuestions: number;
    totalTestPapers: number;
    totalAttempts: number;
    totalCurrentAffairs: number;
    totalNotifications: number;
  };
  recentUsers: {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
  }[];
  recentTestPapers: {
    id: string;
    title: string;
    isPublished: boolean;
    createdAt: Date;
  }[];
}
