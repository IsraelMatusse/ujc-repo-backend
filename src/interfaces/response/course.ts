import { SubjectResponse } from "./subject";

export interface CourseResponse {
  id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
}

export interface CourseWithSubjects {
  id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
  subjects: SubjectResponse[];
}
