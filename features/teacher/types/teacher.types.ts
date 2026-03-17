export interface Question {
  id: string;
  questionText: string;
  questionType: string;
  imageUrl: string | null;
  isActive: boolean;
  source: string;
  createdAt: string;
  updatedAt: string;
  subject: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    fullName: string;
  };
  answerOptions: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    fullName: string;
  };
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
}

export interface CreateQuestionDto {
  questionText: string;
  questionType: string;
  subjectId: string;
  imageUrl?: string;
  answerOptions: {
    optionLabel: string;
    optionText: string;
    isCorrect: boolean;
    displayOrder: number;
  }[];
}

export interface UpdateQuestionDto {
  questionText?: string;
  subjectId?: string;
  answerOptions?: {
    optionLabel: string;
    optionText: string;
    isCorrect: boolean;
    displayOrder: number;
  }[];
}
