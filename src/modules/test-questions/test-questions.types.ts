export interface TestQuestionResponse {
  id: string;
  testPaperId: string;
  questionId: string;
  sortOrder: number;
}

export interface AddTestQuestionInput {
  questionId: string;
  sortOrder?: number;
}

export interface BulkAddTestQuestionsInput {
  questions: AddTestQuestionInput[];
}

export interface ReorderTestQuestionsInput {
  items: {
    questionId: string;
    sortOrder: number;
  }[];
}
