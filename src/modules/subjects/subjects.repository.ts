import { Subject, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateSubjectInput,
  UpdateSubjectInput,
  SubjectQueryFilters,
} from "./subjects.types";
import { slugify } from "../../common/string";

export class SubjectsRepository {
  async findAll(
    filters: SubjectQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Subject[], number]> {
    const where: Prisma.SubjectWhereInput = {};

    if (filters.search) {
      where.name = { contains: filters.search, mode: "insensitive" };
    }

    if (filters.examId) {
      where.examId = filters.examId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: limit,
        include: { exam: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.subject.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Subject | null> {
    return prisma.subject.findUnique({
      where: { id },
      include: { exam: true },
    });
  }

  async findBySlug(slug: string): Promise<Subject | null> {
    return prisma.subject.findUnique({
      where: { slug },
      include: { exam: true },
    });
  }

  async findByName(name: string): Promise<Subject | null> {
    return prisma.subject.findFirst({
      where: { name },
    });
  }

  async create(data: CreateSubjectInput): Promise<Subject> {
    const slug = slugify(data.name);
    return prisma.subject.create({
      data: {
        name: data.name,
        slug,
        examId: data.examId,
        iconUrl: data.iconUrl,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { exam: true },
    });
  }

  async update(id: string, data: UpdateSubjectInput): Promise<Subject> {
    const updateData: Prisma.SubjectUpdateInput = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    if (data.examId !== undefined) {
      updateData.exam = { connect: { id: data.examId } };
    }
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    return prisma.subject.update({
      where: { id },
      data: updateData,
      include: { exam: true },
    });
  }

  async delete(id: string): Promise<Subject> {
    return prisma.subject.delete({
      where: { id },
    });
  }
}
