import { MaterialResponse } from "./material";
import { SubjectResponse } from "./subject";
import { YearWithSemester } from "./year";

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
export interface CourseDetails {
  id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
  subjects: SubjectResponse[];
  years: YearWithSemester[];
  material: MaterialResponse[];
}
