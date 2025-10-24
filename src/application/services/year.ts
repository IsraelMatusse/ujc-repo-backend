import { PrismaClient, Year } from "#generated/prisma";
import { ConflictException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { YearCreationData } from "#interfaces/request/year";
import { YearWithSemester } from "#interfaces/response/year";
import { da } from "zod/v4/locales";

const prisma = new PrismaClient();
export class YearService {
  async createYear(data: YearCreationData) {
    const code = generateAleatoryCodes();
    if (await this.existsByNameOrOrder(data.name, data.order)) {
      throw new ConflictException("Ano com este nome j\xE1 existe");
    }
    const year = await prisma.year.create({
      data: {
        name: data.name,
        order: data.order,
        code: code,
      },
    });
  }

  async updateYear(id: string, data: YearCreationData) {
    const year = await this.findById(id);
    if (year.name !== data.name) {
      if (await this.existsByName(data.name)) {
        throw new ConflictException("Ano com este nome j\xE1 existe");
      }
    }
    await prisma.year.update({
      where: { id },
      data: {
        name: data.name,
        order: data.order,
      },
    });
  }

  async existsByName(name: string): Promise<boolean> {
    return !!(await prisma.year.findFirst({
      where: { name },
    }));
  }

  async existsByNameOrOrder(name: string, order: number): Promise<boolean> {
    return !!(await prisma.year.findFirst({
      where: { name, order },
    }));
  }

  async getYears(): Promise<YearWithSemester[]> {
    const years = await prisma.year.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        Semester: true,
      },
    });

    return years.map(({ Semester, ...rest }) => ({
      ...rest,
      semesters: Semester,
    }));
  }

  async findById(id: string): Promise<Year> {
    const year = await prisma.year.findUnique({
      where: { id },
    });
    if (!year) {
      throw new Error("Ano n\xE3o encontrado");
    }
    return year;
  }
}
