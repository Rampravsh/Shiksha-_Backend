import { Request, Response } from "express";
import { UploadsService } from "./uploads.service";
import { ApiResponse } from "../../core/response";
import { getPaginationParams } from "../../core/pagination";
import { UPLOADS_MESSAGES } from "./uploads.constants";
import { UnauthorizedError } from "../../core/errors";

export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  uploadFile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const folder = (req.body.folder as string) || "shiksha/general";
    const upload = await this.uploadsService.uploadFile(
      req.user.id,
      req.file,
      folder,
    );
    ApiResponse.created(res, UPLOADS_MESSAGES.UPLOADED, upload);
  };

  getAllUploads = async (req: Request, res: Response): Promise<void> => {
    const pagination = getPaginationParams(req.query);
    const filters = {
      folder: req.query.folder as string | undefined,
      uploadedById: req.query.uploadedById as string | undefined,
    };

    const result = await this.uploadsService.getAllUploads(filters, pagination);
    ApiResponse.success(res, UPLOADS_MESSAGES.FETCHED_ALL, result);
  };

  getUploadById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const upload = await this.uploadsService.getUploadByIdOrPublicId(id);
    ApiResponse.success(res, UPLOADS_MESSAGES.FETCHED_ONE, upload);
  };

  deleteUpload = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const deletedUpload = await this.uploadsService.deleteUpload(id);
    ApiResponse.success(res, UPLOADS_MESSAGES.DELETED, deletedUpload);
  };
}
