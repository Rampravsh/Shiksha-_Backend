import { State } from "@prisma/client";
import { StatesRepository } from "./states.repository";
import {
  CreateStateInput,
  UpdateStateInput,
  StateQueryFilters,
} from "./states.types";
import { NotFoundError, ConflictError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { STATES_MESSAGES } from "./states.constants";

export class StatesService {
  constructor(private readonly statesRepository: StatesRepository) {}

  async getAllStates(
    filters: StateQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<State>> {
    const [data, total] = await this.statesRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getStateByIdOrCode(identifier: string): Promise<State> {
    let state = await this.statesRepository.findById(identifier);
    if (!state) {
      state = await this.statesRepository.findByCode(identifier);
    }
    if (!state) {
      throw new NotFoundError(STATES_MESSAGES.NOT_FOUND);
    }
    return state;
  }

  async createState(input: CreateStateInput): Promise<State> {
    const existingCode = await this.statesRepository.findByCode(input.code);
    if (existingCode) {
      throw new ConflictError(STATES_MESSAGES.ALREADY_EXISTS);
    }

    const existingName = await this.statesRepository.findByName(input.name);
    if (existingName) {
      throw new ConflictError(STATES_MESSAGES.ALREADY_EXISTS);
    }

    return this.statesRepository.create(input);
  }

  async updateState(id: string, input: UpdateStateInput): Promise<State> {
    await this.getStateByIdOrCode(id);

    if (input.code) {
      const existingCode = await this.statesRepository.findByCode(input.code);
      if (existingCode && existingCode.id !== id) {
        throw new ConflictError(STATES_MESSAGES.ALREADY_EXISTS);
      }
    }

    if (input.name) {
      const existingName = await this.statesRepository.findByName(input.name);
      if (existingName && existingName.id !== id) {
        throw new ConflictError(STATES_MESSAGES.ALREADY_EXISTS);
      }
    }

    return this.statesRepository.update(id, input);
  }

  async deleteState(id: string): Promise<State> {
    await this.getStateByIdOrCode(id);
    return this.statesRepository.delete(id);
  }
}
