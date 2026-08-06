import { CurrentAffair, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateCurrentAffairInput,
  UpdateCurrentAffairInput,
  CurrentAffairQueryFilters,
} from "./current-affairs.types";
import { slugify } from "../../common/string";

export class CurrentAffairsRepository {
  async findAll(
    filters: CurrentAffairQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[CurrentAffair[], number]> {
    const where: Prisma.CurrentAffairWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.isPublished !== undefined)
      where.isPublished = filters.isPublished;

    return Promise.all([
      prisma.currentAffair.findMany({
        where,
        skip,
        take: limit,
        include: {
          createdBy: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.currentAffair.count({ where }),
    ]);
  }

  async findById(id: string): Promise<CurrentAffair | null> {
    return prisma.currentAffair.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async findBySlug(slug: string): Promise<CurrentAffair | null> {
    return prisma.currentAffair.findUnique({
      where: { slug },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async create(
    data: CreateCurrentAffairInput,
    createdById: string,
  ): Promise<CurrentAffair> {
    const slug = slugify(data.title);
    return prisma.currentAffair.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? new Date() : null,
        createdById,
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async update(
    id: string,
    data: UpdateCurrentAffairInput,
  ): Promise<CurrentAffair> {
    const updateData: Prisma.CurrentAffairUpdateInput = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
      updateData.publishedAt = data.isPublished ? new Date() : null;
    }

    return prisma.currentAffair.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, fullName: true } },
      },
    });
  }

  async delete(id: string): Promise<CurrentAffair> {
    return prisma.currentAffair.delete({ where: { id } });
  }
}
