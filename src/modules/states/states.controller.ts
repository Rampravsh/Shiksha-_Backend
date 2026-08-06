import { Request, Response } from "express";
import { StatesService } from "./states.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { STATES_MESSAGES } from "./states.constants";
import { CreateStateInput, UpdateStateInput } from "./states.types";

export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  getAllStates = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };

    const result = await this.statesService.getAllStates(filters, pagination);
    ApiResponse.success(res, STATES_MESSAGES.FETCHED_ALL, result);
  };

  getStateById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const state = await this.statesService.getStateByIdOrCode(id);
    ApiResponse.success(res, STATES_MESSAGES.FETCHED_ONE, state);
  };

  createState = async (req: Request, res: Response): Promise<void> => {
    const input: CreateStateInput = req.body;
    const newState = await this.statesService.createState(input);
    ApiResponse.created(res, STATES_MESSAGES.CREATED, newState);
  };

  updateState = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const input: UpdateStateInput = req.body;
    const updatedState = await this.statesService.updateState(id, input);
    ApiResponse.success(res, STATES_MESSAGES.UPDATED, updatedState);
  };

  deleteState = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedState = await this.statesService.deleteState(id);
    ApiResponse.success(res, STATES_MESSAGES.DELETED, deletedState);
  };
}
