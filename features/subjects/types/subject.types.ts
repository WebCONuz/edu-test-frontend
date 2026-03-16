export interface Subject {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectsResponse {
  data: Subject[];
}
