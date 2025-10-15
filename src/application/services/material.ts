import { PrismaClient } from "#generated/prisma";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";
import { MaterialRequest } from "#interfaces/request/material";
import { MaterialResponse } from "#interfaces/response/material";

const prisma = new PrismaClient();
export class MaterialService {
  async createMaterial(data: MaterialRequest) {
    const material = await prisma.material.create({
      data: {
        fileId: data.fileId,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        type: data.type,
      },
    });
  }

  async getMaterials(): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      where: {
        status: true,
      },
      include: {
        file: true,
        subject: true,
      },
    });
    return materials.map((material) => ({
      id: material.id,
      file: material.file,
      author: material.author ?? "",
      title: material.title,
      description: material.description ?? "",
      type: material.type,
      createdAt: formatDateToSouthAfrica(material.createdAt),
      status: material.status,
      subject: material.subject.name,
    }));
  }

  async getMaterialsBySubject(subjectId: string): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      where: {
        subjectId,
        status: true,
      },
      include: {
        file: true,
        subject: true,
      },
    });
    return materials.map((material) => ({
      id: material.id,
      file: material.file,
      author: material.author ?? "",
      title: material.title,
      description: material.description ?? "",
      type: material.type,
      createdAt: formatDateToSouthAfrica(material.createdAt),
      status: material.status,
      subject: material.subject.name,
    }));
  }

  async getMaterialByCourse(courseId: string): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      where: {
        subject: {
          courseId,
        },
        status: true,
      },
      include: {
        file: true,
        subject: true,
      },
    });
    return materials.map((material) => ({
      id: material.id,
      file: material.file,
      author: material.author ?? "",
      title: material.title,
      description: material.description ?? "",
      type: material.type,
      createdAt: formatDateToSouthAfrica(material.createdAt),
      status: material.status,
      subject: material.subject.name,
    }));
  }
}
