import { PrismaClient } from "#generated/prisma";
import { FileCreateData } from "#interfaces/request/file";

const prisma = new PrismaClient();
export class FileService {
  async createFile(data: FileCreateData) {
    return await prisma.file.create({
      data: {
        path: data.path,
        designation: data.designation,
        type: data.type,
      },
    });
  }
}
