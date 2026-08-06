import { Category, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryFilters,
} from "./categories.types";
import { slugify } from "../../common/string";

export class CategoriesRepository {
  async findAll(
    filters: CategoryQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Category[], number]> {
    const where: Prisma.CategoryWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.category.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const slug = slugify(data.name);
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        iconUrl: data.iconUrl,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const updateData: Prisma.CategoryUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}
