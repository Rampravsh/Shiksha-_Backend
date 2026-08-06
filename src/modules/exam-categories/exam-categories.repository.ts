import { ExamCategory, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateExamCategoryInput,
  UpdateExamCategoryInput,
  ExamCategoryQueryFilters,
} from "./exam-categories.types";
import { slugify } from "../../common/string";

export class ExamCategoriesRepository {
  async findAll(
    filters: ExamCategoryQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[ExamCategory[], number]> {
    const where: Prisma.ExamCategoryWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.examCategory.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.examCategory.count({ where }),
    ]);
  }

  async findById(id: string): Promise<ExamCategory | null> {
    return prisma.examCategory.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findBySlug(slug: string): Promise<ExamCategory | null> {
    return prisma.examCategory.findUnique({
      where: { slug },
      include: { category: true },
    });
  }

  async findByName(name: string): Promise<ExamCategory | null> {
    return prisma.examCategory.findFirst({
      where: { name },
    });
  }

  async create(data: CreateExamCategoryInput): Promise<ExamCategory> {
    const slug = slugify(data.name);
    return prisma.examCategory.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        type: data.type,
        description: data.description,
        iconUrl: data.iconUrl,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { category: true },
    });
  }

  async update(
    id: string,
    data: UpdateExamCategoryInput,
  ): Promise<ExamCategory> {
    const updateData: Prisma.ExamCategoryUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    if (data.categoryId !== undefined) {
      updateData.category = { connect: { id: data.categoryId } };
    }
    if (data.type !== undefined) updateData.type = data.type;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.examCategory.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  }

  async delete(id: string): Promise<ExamCategory> {
    return prisma.examCategory.delete({
      where: { id },
    });
  }
}
