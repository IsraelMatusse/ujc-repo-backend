import { PrismaClient, Semester } from "#generated/prisma";
import { ConflictException, NotFoundException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { SemesterCreationData } from "#interfaces/request/semester";
import { SemesterResponse } from "#interfaces/response/semester";
import { YearService } from "./year";

const prisma = new PrismaClient();
const yearService = new YearService();
export class SemesterService {
  async existsByName(name: string): Promise<boolean> {
    return !!(await prisma.semester.findFirst({
      where: { name },
    }));
  }

  async createSemester(data: SemesterCreationData) {
    if (await this.existsByName(data.name)) {
      throw new ConflictException("Semestre com este nome j\xE1 existe");
    }

    const year = await yearService.findById(data.yearId);
    const code = generateAleatoryCodes();
    await prisma.semester.create({
      data: {
        name: data.name,
        yearId: year.id,
        code: code,
      },
    });
  }

  async getSemesters(): Promise<SemesterResponse[]> {
    const semesters = await prisma.semester.findMany();
    return semesters.map((semester) => ({
      id: semester.id,
      name: semester.name,
      yearId: semester.yearId,
      code: semester.code,
      year: semester.name,
      status: semester.status,
    }));
  }

  async getSemestersByYear(yearId: string): Promise<SemesterResponse[]> {
    const semesters = await prisma.semester.findMany({
      where: { yearId },
    });
    return semesters.map((semester) => ({
      id: semester.id,
      name: semester.name,
      yearId: semester.yearId,
      code: semester.code,
      year: semester.name,
      status: semester.status,
    }));
  }

  async findById(id: string): Promise<Semester> {
    const semester = await prisma.semester.findUnique({
      where: { id },
    });
    if (!semester) {
      throw new NotFoundException("Semestre n\xE3o encontrado");
    }
    return semester;
  }
}
