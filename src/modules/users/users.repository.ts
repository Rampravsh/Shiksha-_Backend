import { User, Prisma, Upload } from "@prisma/client";
import { prisma } from "../../core/prisma";
import { UpdateUserProfileInput, UserQueryFilters } from "./users.types";

export interface CreateUploadRecordInput {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  folder?: string;
  uploadedById: string;
}

export class UsersRepository {
  async findAll(
    filters: UserQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[User[], number]> {
    const where: Prisma.UserWhereInput = {};

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.stateId) {
      where.stateId = filters.stateId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          state: {
            select: { id: true, name: true, code: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        state: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        state: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(id: string, data: UpdateUserProfileInput): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.stateId !== undefined) {
      updateData.state = { connect: { id: data.stateId } };
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        state: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async updateAvatar(id: string, avatarUrl: string | null): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { avatarUrl },
      include: {
        state: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async createUploadRecord(data: CreateUploadRecordInput): Promise<Upload> {
    return prisma.upload.create({
      data: {
        publicId: data.publicId,
        url: data.url,
        secureUrl: data.secureUrl,
        format: data.format,
        bytes: data.bytes,
        folder: data.folder,
        uploadedById: data.uploadedById,
      },
    });
  }

  async setActiveStatus(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
