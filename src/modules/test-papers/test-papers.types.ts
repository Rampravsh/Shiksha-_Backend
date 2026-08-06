import { Language } from "@prisma/client";

export interface TestPaperResponse {
  id: string;
  title: string;
  slug: string;
  examId: string;
  description?: string | null;
  durationMins: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  totalQuestions: number;
  language: Language;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestPaperInput {
  title: string;
  examId: string;
  description?: string;
  durationMins?: number;
  totalMarks?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  language?: Language;
  isPublished?: boolean;
}

export interface UpdateTestPaperInput {
  title?: string;
  examId?: string;
  description?: string;
  durationMins?: number;
  totalMarks?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  language?: Language;
  isPublished?: boolean;
}

export interface TestPaperQueryFilters {
  search?: string;
  examId?: string;
  language?: Language;
  isPublished?: boolean;
}
