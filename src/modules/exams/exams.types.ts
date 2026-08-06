export interface ExamResponse {
  id: string;
  title: string;
  slug: string;
  examCategoryId: string;
  stateId?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamInput {
  title: string;
  examCategoryId: string;
  stateId?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateExamInput {
  title?: string;
  examCategoryId?: string;
  stateId?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ExamQueryFilters {
  search?: string;
  examCategoryId?: string;
  stateId?: string;
  isActive?: boolean;
}
