import { File, MaterialType } from "#generated/prisma";

export interface MaterialResponse {
  id: string;
  file: File;
  author: string;
  title: string;
  description: string;
  type: MaterialType;
  createdAt: string;
  status: boolean;
  subject: string;
  subjectId: string;
  couseId: string;
  semesterId: string;
  semester: string;
  yearId: string;
  year: string;
}
