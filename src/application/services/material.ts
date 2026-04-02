import { Material, PrismaClient } from "#generated/prisma";
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
        author: data.author,
      },
    });
  }

  async getMaterials(): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: true,
        deletedAt: null,
      },
      include: {
        file: true,
        subject: {
          include: {
            semester: {
              include: {
                year: true,
              },
            },
          },
        },
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
      subjectId: material.subject.id,
      couseId: material.subject.courseId,
      semesterId: material.subject.semesterId,
      semester: material.subject.semester.name,
      yearId: material.subject.semester.year.id,
      year: material.subject.semester.year.name,
    }));
  }

  async getMaterialsBySubject(subjectId: string): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        subjectId,
        status: true,
        deletedAt: null,
      },
      include: {
        file: true,
        subject: {
          include: {
            semester: {
              include: {
                year: true,
              },
            },
          },
        },
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
      subjectId: material.subject.id,
      couseId: material.subject.courseId,
      semesterId: material.subject.semesterId,
      semester: material.subject.semester.name,
      yearId: material.subject.semester.year.id,
      year: material.subject.semester.year.name,
    }));
  }

  async getMaterialByCourse(courseId: string): Promise<MaterialResponse[]> {
    const materials = await prisma.material.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        subject: {
          courseId,
        },
        status: true,
        deletedAt: null,
      },
      include: {
        file: true,
        subject: {
          include: {
            semester: {
              include: {
                year: true,
              },
            },
          },
        },
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
      subjectId: material.subject.id,
      couseId: material.subject.courseId,
      semesterId: material.subject.semesterId,
      semester: material.subject.semester.name,
      yearId: material.subject.semester.year.id,
      year: material.subject.semester.year.name,
    }));
  }

  async findById(id: string): Promise<Material> {
    const material = await prisma.material.findUnique({
      where: {
        id: id,
        status: true,
        deletedAt: null,
      },
    });
    if (!material) {
      throw new Error("Material não encontrado");
    }
    return material;
  }

  async deleteMaterial(id: string) {
    const material = await this.findById(id);
    await prisma.material.update({
      where: { id: material.id },
      data: {
        status: false,
        deletedAt: new Date(),
      },
    });
  }
}
