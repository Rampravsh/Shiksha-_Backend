import { Upload, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { CreateUploadInput, UploadQueryFilters } from "./uploads.types";

export class UploadsRepository {
  async findAll(
    filters: UploadQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Upload[], number]> {
    const where: Prisma.UploadWhereInput = {};

    if (filters.folder) {
      where.folder = filters.folder;
    }

    if (filters.uploadedById) {
      where.uploadedById = filters.uploadedById;
    }

    return Promise.all([
      prisma.upload.findMany({
        where,
        skip,
        take: limit,
        include: {
          uploadedBy: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.upload.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Upload | null> {
    return prisma.upload.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async findByPublicId(publicId: string): Promise<Upload | null> {
    return prisma.upload.findUnique({
      where: { publicId },
      include: {
        uploadedBy: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async create(data: CreateUploadInput): Promise<Upload> {
    return prisma.upload.create({
      data: {
        publicId: data.publicId,
        url: data.url,
        secureUrl: data.secureUrl,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        folder: data.folder,
        uploadedById: data.uploadedById,
      },
      include: {
        uploadedBy: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<Upload> {
    return prisma.upload.delete({
      where: { id },
    });
  }
}
