import { MaterialType } from "#generated/prisma";

export interface MaterialRequest {
  fileId: string;
  subjectId: string;
  title: string | "";
  description: string | "";
  type: MaterialType;
  author: string | "";
}
