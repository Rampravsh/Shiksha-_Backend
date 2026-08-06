export interface StateResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStateInput {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateStateInput {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface StateQueryFilters {
  search?: string;
  isActive?: boolean;
}
