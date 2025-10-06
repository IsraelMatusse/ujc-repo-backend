import { Course, PrismaClient } from "#generated/prisma";
import { ConflictException, NotFoundException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";
import { CourseRequest } from "#interfaces/request/course";
import { CourseResponse } from "#interfaces/response/course";

const prisma = new PrismaClient();
export class CourseService {
  async getAllCourses(): Promise<CourseResponse[]> {
    const courses = await prisma.course.findMany();
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      status: course.status,
      createdAt: formatDateToSouthAfrica(course.createdAt),
    }));
  }

  async existsByName(name: string): Promise<boolean> {
    return !!(await prisma.course.findFirst({
      where: { name },
    }));
  }

  async createCourse(data: CourseRequest) {
    if (await this.existsByName(data.name)) {
      throw new ConflictException("Curso com este nome j\xE1 existe");
    }
    const code = generateAleatoryCodes();
    await prisma.course.create({
      data: {
        name: data.name,
        code: code,
      },
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException("Curso n\xE3o encontrado");
    }
    return course;
  }
}
