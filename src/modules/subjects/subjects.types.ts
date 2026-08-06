export interface SubjectResponse {
  id: string;
  name: string;
  slug: string;
  examId: string;
  iconUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectInput {
  name: string;
  examId: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSubjectInput {
  name?: string;
  examId?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubjectQueryFilters {
  search?: string;
  examId?: string;
  isActive?: boolean;
}
