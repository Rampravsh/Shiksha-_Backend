export interface CreateCurrentAffairInput {
  title: string;
  description: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface UpdateCurrentAffairInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface CurrentAffairQueryFilters {
  search?: string;
  isPublished?: boolean;
}
