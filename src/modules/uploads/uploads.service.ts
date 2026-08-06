import { Upload } from "@prisma/client";
import { UploadsRepository } from "./uploads.repository";
import { UploadQueryFilters } from "./uploads.types";
import { NotFoundError, BadRequestError } from "../../core/errors";
import {
  PaginationParams,
  PaginatedResult,
  createPaginatedResponse,
} from "../../core/pagination";
import { UPLOADS_MESSAGES } from "./uploads.constants";
import {
  uploadImageBuffer,
  deleteCloudinaryAsset,
} from "../../integrations/cloudinary";

export class UploadsService {
  constructor(private readonly uploadsRepository: UploadsRepository) {}

  async getAllUploads(
    filters: UploadQueryFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Upload>> {
    const [data, total] = await this.uploadsRepository.findAll(
      filters,
      pagination.skip,
      pagination.limit,
    );
    return createPaginatedResponse(data, total, pagination);
  }

  async getUploadByIdOrPublicId(identifier: string): Promise<Upload> {
    let upload = await this.uploadsRepository.findById(identifier);
    if (!upload) {
      upload = await this.uploadsRepository.findByPublicId(identifier);
    }
    if (!upload) {
      throw new NotFoundError(UPLOADS_MESSAGES.NOT_FOUND);
    }
    return upload;
  }

  async uploadFile(
    userId: string,
    file?: Express.Multer.File,
    folder = "shiksha/general",
  ): Promise<Upload> {
    if (!file) {
      throw new BadRequestError(UPLOADS_MESSAGES.FILE_REQUIRED);
    }

    const uploadResult = await uploadImageBuffer(file.buffer, folder);

    return this.uploadsRepository.create({
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      folder: uploadResult.folder,
      uploadedById: userId,
    });
  }

  async deleteUpload(identifier: string): Promise<Upload> {
    const upload = await this.getUploadByIdOrPublicId(identifier);
    await deleteCloudinaryAsset(upload.publicId);
    return this.uploadsRepository.delete(upload.id);
  }
}
