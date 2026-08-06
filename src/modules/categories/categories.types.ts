export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryQueryFilters {
  search?: string;
  isActive?: boolean;
}
