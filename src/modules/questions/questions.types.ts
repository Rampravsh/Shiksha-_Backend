import {
  QuestionType,
  QuestionSource,
  QuestionStatus,
  Difficulty,
  Prisma,
} from "@prisma/client";

export interface QuestionOption {
  id: string;
  textEn: string;
  textHi?: string;
  imageEn?: string;
  imageHi?: string;
}

export interface CreateQuestionInput {
  textEn: string;
  textHi?: string;
  explanationEn?: string;
  explanationHi?: string;
  type?: QuestionType;
  source?: QuestionSource;
  status?: QuestionStatus;
  difficulty?: Difficulty;
  examId: string;
  subjectId: string;
  topicId?: string;
  options: QuestionOption[] | Prisma.InputJsonValue;
  correctAnswer: string[] | string | Prisma.InputJsonValue;
  marks?: number;
  negativeMarks?: number;
  questionImageEn?: string;
  questionImageHi?: string;
  solutionImageEn?: string;
  solutionImageHi?: string;
  yearAsked?: number;
}

export interface UpdateQuestionInput {
  textEn?: string;
  textHi?: string;
  explanationEn?: string;
  explanationHi?: string;
  type?: QuestionType;
  source?: QuestionSource;
  status?: QuestionStatus;
  difficulty?: Difficulty;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  options?: QuestionOption[] | Prisma.InputJsonValue;
  correctAnswer?: string[] | string | Prisma.InputJsonValue;
  marks?: number;
  negativeMarks?: number;
  questionImageEn?: string;
  questionImageHi?: string;
  solutionImageEn?: string;
  solutionImageHi?: string;
  yearAsked?: number;
}

export interface QuestionQueryFilters {
  search?: string;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  type?: QuestionType;
  source?: QuestionSource;
  status?: QuestionStatus;
  difficulty?: Difficulty;
  yearAsked?: number;
}

export interface BulkCreateQuestionsInput {
  questions: CreateQuestionInput[];
}
