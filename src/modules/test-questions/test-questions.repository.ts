import { TestQuestion } from "@prisma/client";
import { prisma } from "../../core/prisma";
import {
  AddTestQuestionInput,
  ReorderTestQuestionsInput,
} from "./test-questions.types";

export class TestQuestionsRepository {
  async findByTestPaperId(testPaperId: string): Promise<TestQuestion[]> {
    return prisma.testQuestion.findMany({
      where: { testPaperId },
      include: {
        question: {
          include: {
            subject: { select: { id: true, name: true } },
            topic: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findByTestAndQuestion(
    testPaperId: string,
    questionId: string,
  ): Promise<TestQuestion | null> {
    return prisma.testQuestion.findUnique({
      where: {
        testPaperId_questionId: {
          testPaperId,
          questionId,
        },
      },
    });
  }

  async addQuestion(
    testPaperId: string,
    data: AddTestQuestionInput,
  ): Promise<TestQuestion> {
    return prisma.testQuestion.create({
      data: {
        testPaperId,
        questionId: data.questionId,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { question: true },
    });
  }

  async addManyQuestions(
    testPaperId: string,
    questions: AddTestQuestionInput[],
  ): Promise<number> {
    const formatted = questions.map((q) => ({
      testPaperId,
      questionId: q.questionId,
      sortOrder: q.sortOrder ?? 0,
    }));

    const result = await prisma.testQuestion.createMany({
      data: formatted,
      skipDuplicates: true,
    });
    return result.count;
  }

  async reorderQuestions(
    testPaperId: string,
    input: ReorderTestQuestionsInput,
  ): Promise<void> {
    const updates = input.items.map((item) =>
      prisma.testQuestion.update({
        where: {
          testPaperId_questionId: {
            testPaperId,
            questionId: item.questionId,
          },
        },
        data: { sortOrder: item.sortOrder },
      }),
    );

    await prisma.$transaction(updates);
  }

  async removeQuestion(
    testPaperId: string,
    questionId: string,
  ): Promise<TestQuestion> {
    return prisma.testQuestion.delete({
      where: {
        testPaperId_questionId: {
          testPaperId,
          questionId,
        },
      },
    });
  }

  async countByTestPaperId(
    testPaperId: string,
  ): Promise<{ count: number; totalMarks: number }> {
    const questions = await prisma.testQuestion.findMany({
      where: { testPaperId },
      include: {
        question: { select: { marks: true } },
      },
    });
    const totalMarks = questions.reduce(
      (acc, q) => acc + (q.question?.marks || 0),
      0,
    );
    return { count: questions.length, totalMarks };
  }

  async addQuestionWithTotalsRecalculation(
    testPaperId: string,
    data: AddTestQuestionInput,
  ): Promise<TestQuestion> {
    return prisma.$transaction(async (tx) => {
      const created = await tx.testQuestion.create({
        data: {
          testPaperId,
          questionId: data.questionId,
          sortOrder: data.sortOrder ?? 0,
        },
        include: { question: true },
      });

      const questions = await tx.testQuestion.findMany({
        where: { testPaperId },
        include: { question: { select: { marks: true } } },
      });
      const totalMarks = questions.reduce(
        (acc, q) => acc + (q.question?.marks || 0),
        0,
      );

      await tx.testPaper.update({
        where: { id: testPaperId },
        data: {
          totalQuestions: questions.length,
          totalMarks,
        },
      });

      return created;
    });
  }

  async removeQuestionWithTotalsRecalculation(
    testPaperId: string,
    questionId: string,
  ): Promise<TestQuestion> {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.testQuestion.delete({
        where: {
          testPaperId_questionId: {
            testPaperId,
            questionId,
          },
        },
      });

      const questions = await tx.testQuestion.findMany({
        where: { testPaperId },
        include: { question: { select: { marks: true } } },
      });
      const totalMarks = questions.reduce(
        (acc, q) => acc + (q.question?.marks || 0),
        0,
      );

      await tx.testPaper.update({
        where: { id: testPaperId },
        data: {
          totalQuestions: questions.length,
          totalMarks,
        },
      });

      return deleted;
    });
  }
}
