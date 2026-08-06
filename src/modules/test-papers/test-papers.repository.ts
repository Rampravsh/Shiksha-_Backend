import { TestPaper, Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateTestPaperInput,
  UpdateTestPaperInput,
  TestPaperQueryFilters,
} from "./test-papers.types";
import { slugify } from "../../common/string";

export class TestPapersRepository {
  async findAll(
    filters: TestPaperQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[TestPaper[], number]> {
    const where: Prisma.TestPaperWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.examId) where.examId = filters.examId;
    if (filters.language) where.language = filters.language;
    if (filters.isPublished !== undefined)
      where.isPublished = filters.isPublished;

    return Promise.all([
      prisma.testPaper.findMany({
        where,
        skip,
        take: limit,
        include: {
          exam: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.testPaper.count({ where }),
    ]);
  }

  async findById(id: string): Promise<TestPaper | null> {
    return prisma.testPaper.findUnique({
      where: { id },
      include: {
        exam: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<TestPaper | null> {
    return prisma.testPaper.findUnique({
      where: { slug },
      include: {
        exam: true,
      },
    });
  }

  async findByTitle(title: string, examId: string): Promise<TestPaper | null> {
    return prisma.testPaper.findFirst({
      where: { title, examId },
    });
  }

  async create(data: CreateTestPaperInput): Promise<TestPaper> {
    const slug = slugify(data.title);
    return prisma.testPaper.create({
      data: {
        title: data.title,
        slug,
        examId: data.examId,
        description: data.description,
        durationMins: data.durationMins ?? 60,
        totalMarks: data.totalMarks ?? 100.0,
        positiveMarks: data.positiveMarks ?? 1.0,
        negativeMarks: data.negativeMarks ?? 0.0,
        language: data.language,
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? new Date() : null,
      },
      include: { exam: true },
    });
  }

  async update(id: string, data: UpdateTestPaperInput): Promise<TestPaper> {
    const updateData: Prisma.TestPaperUpdateInput = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = slugify(data.title);
    }
    if (data.examId !== undefined) {
      updateData.exam = { connect: { id: data.examId } };
    }
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.durationMins !== undefined)
      updateData.durationMins = data.durationMins;
    if (data.totalMarks !== undefined) updateData.totalMarks = data.totalMarks;
    if (data.positiveMarks !== undefined)
      updateData.positiveMarks = data.positiveMarks;
    if (data.negativeMarks !== undefined)
      updateData.negativeMarks = data.negativeMarks;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.isPublished !== undefined) {
      updateData.isPublished = data.isPublished;
      updateData.publishedAt = data.isPublished ? new Date() : null;
    }

    return prisma.testPaper.update({
      where: { id },
      data: updateData,
      include: { exam: true },
    });
  }

  async setPublishStatus(id: string, isPublished: boolean): Promise<TestPaper> {
    return prisma.testPaper.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { exam: true },
    });
  }

  async updateTotals(
    id: string,
    totalQuestions: number,
    totalMarks: number,
  ): Promise<TestPaper> {
    return prisma.testPaper.update({
      where: { id },
      data: { totalQuestions, totalMarks },
    });
  }

  async delete(id: string): Promise<TestPaper> {
    return prisma.testPaper.delete({
      where: { id },
    });
  }
}
