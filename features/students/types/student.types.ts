export interface CheckPhoneDto {
  phone: string;
}

export interface CheckPhoneResponse {
  exists: boolean;
  student?: {
    id: string;
    fullName: string;
    phone: string;
  };
}

export interface CreateStudentDto {
  fullName: string;
  phone: string;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
}

export interface StartSessionDto {
  studentId: string;
  subjectId: string;
  requestedCount: number;
}

export interface AnswerOption {
  id: string;
  optionLabel: string;
  optionText: string;
  displayOrder: number;
}

export interface SessionQuestion {
  order: number;
  questionId: string;
  questionText: string;
  questionType: string;
  imageUrl: string | null;
  answerOptions: AnswerOption[];
}

export interface StartSessionResponse {
  sessionId: string;
  totalQuestions: number;
  subject: string;
  questions: SessionQuestion[];
}

export interface ResultQuestion {
  order: number;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
}

export interface TestResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSec: number;
  subject: string;
  questions: ResultQuestion[];
}

export interface TestSession {
  id: string;
  score: number;
  percentage: string;
  actualCount: number;
  requestedCount: number;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  subject: {
    name: string;
  };
}

export interface MyResultsResponse {
  id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  testSessions: TestSession[];
}
