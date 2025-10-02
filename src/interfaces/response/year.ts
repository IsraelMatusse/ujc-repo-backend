import { Semester } from "#generated/prisma";

export interface YearWithSemester {
  name: string;
  order: number;
  code: string;
  semesters: Semester[];
}
