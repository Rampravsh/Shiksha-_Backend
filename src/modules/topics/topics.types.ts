export interface TopicResponse {
  id: string;
  name: string;
  slug: string;
  subjectId: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTopicInput {
  name: string;
  subjectId: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateTopicInput {
  name?: string;
  subjectId?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface TopicQueryFilters {
  search?: string;
  subjectId?: string;
  isActive?: boolean;
}
