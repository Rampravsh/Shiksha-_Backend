import { Exam, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateExamInput,
  UpdateExamInput,
  ExamQueryFilters,
} from "./exams.types";
import { slugify } from "../../common/string";

export class ExamsRepository {
  async findAll(
    filters: ExamQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Exam[], number]> {
    const where: Prisma.ExamWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.examCategoryId) {
      where.examCategoryId = filters.examCategoryId;
    }

    if (filters.stateId) {
      where.stateId = filters.stateId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        include: {
          examCategory: true,
          state: { select: { id: true, name: true, code: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      }),
      prisma.exam.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Exam | null> {
    return prisma.exam.findUnique({
      where: { id },
      include: {
        examCategory: true,
        state: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findBySlug(slug: string): Promise<Exam | null> {
    return prisma.exam.findUnique({
      where: { slug },
      include: {
        examCategory: true,
        state: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findByTitle(title: string): Promise<Exam | null> {
    return prisma.exam.findFirst({
      where: { title },
    });
  }

  async create(data: CreateExamInput): Promise<Exam> {
    const slug = slugify(data.title);
    return prisma.exam.create({
      data: {
        title: data.title,
        slug,
        examCategoryId: data.examCategoryId,
        stateId: data.stateId,
        description: data.description,
        iconUrl: data.iconUrl,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: {
        examCategory: true,
        state: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async update(id: string, data: UpdateExamInput): Promise<Exam> {
    const updateData: Prisma.ExamUpdateInput = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
    }
    if (data.examCategoryId !== undefined) {
      updateData.examCategory = { connect: { id: data.examCategoryId } };
    }
    if (data.stateId !== undefined) {
      updateData.state = data.stateId
        ? { connect: { id: data.stateId } }
        : { disconnect: true };
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.exam.update({
      where: { id },
      data: updateData,
      include: {
        examCategory: true,
        state: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async delete(id: string): Promise<Exam> {
    return prisma.exam.delete({
      where: { id },
    });
  }
}
