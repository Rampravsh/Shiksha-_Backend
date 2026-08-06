import { CurrentAffair } from "@prisma/client";
import { CurrentAffairsRepository } from "./current-affairs.repository";
import {
  CreateCurrentAffairInput,
  UpdateCurrentAffairInput,
  CurrentAffairQueryFilters,
} from "./current-affairs.types";
import { NotFoundError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { CURRENT_AFFAIRS_MESSAGES } from "./current-affairs.constants";

export class CurrentAffairsService {
  constructor(
    private readonly currentAffairsRepository: CurrentAffairsRepository,
  ) {}

  async getAllCurrentAffairs(
    filters: CurrentAffairQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CurrentAffair>> {
    const [data, total] = await this.currentAffairsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getByIdOrSlug(identifier: string): Promise<CurrentAffair> {
    let item = await this.currentAffairsRepository.findById(identifier);
    if (!item) {
      item = await this.currentAffairsRepository.findBySlug(identifier);
    }
    if (!item) {
      throw new NotFoundError(CURRENT_AFFAIRS_MESSAGES.NOT_FOUND);
    }
    return item;
  }

  async create(
    input: CreateCurrentAffairInput,
    createdById: string,
  ): Promise<CurrentAffair> {
    return this.currentAffairsRepository.create(input, createdById);
  }

  async update(
    id: string,
    input: UpdateCurrentAffairInput,
  ): Promise<CurrentAffair> {
    await this.getByIdOrSlug(id);
    return this.currentAffairsRepository.update(id, input);
  }

  async publish(id: string): Promise<CurrentAffair> {
    await this.getByIdOrSlug(id);
    return this.currentAffairsRepository.update(id, { isPublished: true });
  }

  async archive(id: string): Promise<CurrentAffair> {
    await this.getByIdOrSlug(id);
    return this.currentAffairsRepository.update(id, { isPublished: false });
  }

  async delete(id: string): Promise<CurrentAffair> {
    await this.getByIdOrSlug(id);
    return this.currentAffairsRepository.delete(id);
  }
}
