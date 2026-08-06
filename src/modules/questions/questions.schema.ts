import { z } from "zod";
import {
  QuestionType,
  QuestionSource,
  QuestionStatus,
  Difficulty,
} from "@prisma/client";

export const createQuestionSchema = z.object({
  textEn: z
    .string()
    .min(5, "Question English text must be at least 5 characters"),
  textHi: z.string().optional(),
  explanationEn: z.string().optional(),
  explanationHi: z.string().optional(),
  type: z.nativeEnum(QuestionType).optional().default(QuestionType.MCQ),
  source: z
    .nativeEnum(QuestionSource)
    .optional()
    .default(QuestionSource.CUSTOM),
  status: z.nativeEnum(QuestionStatus).optional().default(QuestionStatus.DRAFT),
  difficulty: z.nativeEnum(Difficulty).optional().default(Difficulty.MEDIUM),
  examId: z.string().uuid("Invalid exam ID"),
  subjectId: z.string().uuid("Invalid subject ID"),
  topicId: z.string().uuid("Invalid topic ID").optional(),
  options: z.any().refine((val) => val !== undefined, "Options are required"),
  correctAnswer: z
    .any()
    .refine((val) => val !== undefined, "Correct answer is required"),
  marks: z.number().positive().optional().default(1.0),
  negativeMarks: z.number().min(0).optional().default(0.0),
  questionImageEn: z.string().url().optional(),
  questionImageHi: z.string().url().optional(),
  solutionImageEn: z.string().url().optional(),
  solutionImageHi: z.string().url().optional(),
  yearAsked: z.number().int().min(1950).max(2100).optional(),
});

export const updateQuestionSchema = z.object({
  textEn: z.string().min(5).optional(),
  textHi: z.string().optional(),
  explanationEn: z.string().optional(),
  explanationHi: z.string().optional(),
  type: z.nativeEnum(QuestionType).optional(),
  source: z.nativeEnum(QuestionSource).optional(),
  status: z.nativeEnum(QuestionStatus).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  examId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  options: z.any().optional(),
  correctAnswer: z.any().optional(),
  marks: z.number().positive().optional(),
  negativeMarks: z.number().min(0).optional(),
  questionImageEn: z.string().url().optional(),
  questionImageHi: z.string().url().optional(),
  solutionImageEn: z.string().url().optional(),
  solutionImageHi: z.string().url().optional(),
  yearAsked: z.number().int().min(1950).max(2100).optional(),
});

export const questionQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  examId: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  type: z.nativeEnum(QuestionType).optional(),
  source: z.nativeEnum(QuestionSource).optional(),
  status: z.nativeEnum(QuestionStatus).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  yearAsked: z.string().optional(),
});

export const questionIdParamSchema = z.object({
  id: z.string().uuid("Invalid question ID"),
});

export const bulkCreateQuestionsSchema = z.object({
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required"),
});
