import { ExamCategoryType } from "@prisma/client";

export interface ExamCategoryResponse {
  id: string;
  name: string;
  slug: string;
  type: ExamCategoryType;
  categoryId: string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamCategoryInput {
  name: string;
  categoryId: string;
  type?: ExamCategoryType;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateExamCategoryInput {
  name?: string;
  categoryId?: string;
  type?: ExamCategoryType;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ExamCategoryQueryFilters {
  search?: string;
  categoryId?: string;
  type?: ExamCategoryType;
  isActive?: boolean;
}
