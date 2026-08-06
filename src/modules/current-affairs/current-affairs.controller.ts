import { Request, Response } from "express";
import { CurrentAffairsService } from "./current-affairs.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { CURRENT_AFFAIRS_MESSAGES } from "./current-affairs.constants";
import {
  CreateCurrentAffairInput,
  UpdateCurrentAffairInput,
} from "./current-affairs.types";
import { UnauthorizedError } from "../../core/errors";

export class CurrentAffairsController {
  constructor(private readonly currentAffairsService: CurrentAffairsService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      search: req.query.search as string | undefined,
      isPublished:
        req.query.isPublished !== undefined
          ? req.query.isPublished === "true"
          : undefined,
    };
    const result = await this.currentAffairsService.getAllCurrentAffairs(
      filters,
      pagination,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.FETCHED_ALL, result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const item = await this.currentAffairsService.getByIdOrSlug(
      req.params.id as string,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.FETCHED_ONE, item);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const input: CreateCurrentAffairInput = req.body;
    const created = await this.currentAffairsService.create(input, req.user.id);
    ApiResponse.created(res, CURRENT_AFFAIRS_MESSAGES.CREATED, created);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const input: UpdateCurrentAffairInput = req.body;
    const updated = await this.currentAffairsService.update(
      req.params.id as string,
      input,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.UPDATED, updated);
  };

  publish = async (req: Request, res: Response): Promise<void> => {
    const published = await this.currentAffairsService.publish(
      req.params.id as string,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.PUBLISHED, published);
  };

  archive = async (req: Request, res: Response): Promise<void> => {
    const archived = await this.currentAffairsService.archive(
      req.params.id as string,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.ARCHIVED, archived);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const deleted = await this.currentAffairsService.delete(
      req.params.id as string,
    );
    ApiResponse.success(res, CURRENT_AFFAIRS_MESSAGES.DELETED, deleted);
  };
}
