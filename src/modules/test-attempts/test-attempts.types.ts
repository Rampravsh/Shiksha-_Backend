import { AttemptStatus } from "@prisma/client";

export interface StartAttemptInput {
  testPaperId: string;
}

export interface TestAttemptQueryFilters {
  testPaperId?: string;
  status?: AttemptStatus;
}
