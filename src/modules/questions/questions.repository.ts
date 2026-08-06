import { Question, Prisma, QuestionStatus } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionQueryFilters,
} from "./questions.types";

export class QuestionsRepository {
  async findAll(
    filters: QuestionQueryFilters,
    skip: number,
    limit: number,
  ): Promise<[Question[], number]> {
    const where: Prisma.QuestionWhereInput = {};

    if (filters.search) {
      where.OR = [
        { textEn: { contains: filters.search, mode: "insensitive" } },
        { textHi: { contains: filters.search, mode: "insensitive" } },
        { explanationEn: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.examId) where.examId = filters.examId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.type) where.type = filters.type;
    if (filters.source) where.source = filters.source;
    if (filters.status) where.status = filters.status;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.yearAsked !== undefined) where.yearAsked = filters.yearAsked;

    return Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        include: {
          exam: { select: { id: true, title: true, slug: true } },
          subject: { select: { id: true, name: true, slug: true } },
          topic: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.question.count({ where }),
    ]);
  }

  async findById(id: string): Promise<Question | null> {
    return prisma.question.findUnique({
      where: { id },
      include: {
        exam: true,
        subject: true,
        topic: true,
      },
    });
  }

  async findByText(textEn: string, examId: string): Promise<Question | null> {
    return prisma.question.findFirst({
      where: {
        textEn: { equals: textEn, mode: "insensitive" },
        examId,
      },
    });
  }

  async create(data: CreateQuestionInput): Promise<Question> {
    return prisma.question.create({
      data: {
        textEn: data.textEn,
        textHi: data.textHi,
        explanationEn: data.explanationEn,
        explanationHi: data.explanationHi,
        type: data.type,
        source: data.source,
        status: data.status,
        difficulty: data.difficulty,
        examId: data.examId,
        subjectId: data.subjectId,
        topicId: data.topicId,
        options: data.options as Prisma.InputJsonValue,
        correctAnswer: data.correctAnswer as Prisma.InputJsonValue,
        marks: data.marks ?? 1.0,
        negativeMarks: data.negativeMarks ?? 0.0,
        questionImageEn: data.questionImageEn,
        questionImageHi: data.questionImageHi,
        solutionImageEn: data.solutionImageEn,
        solutionImageHi: data.solutionImageHi,
        yearAsked: data.yearAsked,
      },
      include: {
        exam: true,
        subject: true,
        topic: true,
      },
    });
  }

  async createMany(questions: CreateQuestionInput[]): Promise<number> {
    const formatted = questions.map((q) => ({
      textEn: q.textEn,
      textHi: q.textHi,
      explanationEn: q.explanationEn,
      explanationHi: q.explanationHi,
      type: q.type,
      source: q.source,
      status: q.status,
      difficulty: q.difficulty,
      examId: q.examId,
      subjectId: q.subjectId,
      topicId: q.topicId,
      options: q.options as Prisma.InputJsonValue,
      correctAnswer: q.correctAnswer as Prisma.InputJsonValue,
      marks: q.marks ?? 1.0,
      negativeMarks: q.negativeMarks ?? 0.0,
      questionImageEn: q.questionImageEn,
      questionImageHi: q.questionImageHi,
      solutionImageEn: q.solutionImageEn,
      solutionImageHi: q.solutionImageHi,
      yearAsked: q.yearAsked,
    }));

    const result = await prisma.question.createMany({
      data: formatted,
    });
    return result.count;
  }

  async update(id: string, data: UpdateQuestionInput): Promise<Question> {
    const updateData: Prisma.QuestionUpdateInput = {};
    if (data.textEn !== undefined) updateData.textEn = data.textEn;
    if (data.textHi !== undefined) updateData.textHi = data.textHi;
    if (data.explanationEn !== undefined)
      updateData.explanationEn = data.explanationEn;
    if (data.explanationHi !== undefined)
      updateData.explanationHi = data.explanationHi;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.examId !== undefined)
      updateData.exam = { connect: { id: data.examId } };
    if (data.subjectId !== undefined)
      updateData.subject = { connect: { id: data.subjectId } };
    if (data.topicId !== undefined) {
      updateData.topic = data.topicId
        ? { connect: { id: data.topicId } }
        : { disconnect: true };
    }
    if (data.options !== undefined)
      updateData.options = data.options as Prisma.InputJsonValue;
    if (data.correctAnswer !== undefined)
      updateData.correctAnswer = data.correctAnswer as Prisma.InputJsonValue;
    if (data.marks !== undefined) updateData.marks = data.marks;
    if (data.negativeMarks !== undefined)
      updateData.negativeMarks = data.negativeMarks;
    if (data.questionImageEn !== undefined)
      updateData.questionImageEn = data.questionImageEn;
    if (data.questionImageHi !== undefined)
      updateData.questionImageHi = data.questionImageHi;
    if (data.solutionImageEn !== undefined)
      updateData.solutionImageEn = data.solutionImageEn;
    if (data.solutionImageHi !== undefined)
      updateData.solutionImageHi = data.solutionImageHi;
    if (data.yearAsked !== undefined) updateData.yearAsked = data.yearAsked;

    return prisma.question.update({
      where: { id },
      data: updateData,
      include: {
        exam: true,
        subject: true,
        topic: true,
      },
    });
  }

  async setStatus(id: string, status: QuestionStatus): Promise<Question> {
    return prisma.question.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Question> {
    return prisma.question.delete({
      where: { id },
    });
  }
}
