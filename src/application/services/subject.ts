import { PrismaClient, Subject } from "#generated/prisma";
import { NotFoundException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { SubjectRequestData } from "#interfaces/request/subject";
import { CourseService } from "./course";
import { SemesterService } from "./semester";

const prisma = new PrismaClient();
const semesterService = new SemesterService();
const courseService = new CourseService();
export class SubjectService {
  async createSubject(data: SubjectRequestData) {
    const semester = await semesterService.findById(data.semesterId);
    const course = await courseService.findById(data.courseId);
    const code = generateAleatoryCodes();
    await prisma.subject.create({
      data: {
        name: data.name,
        credits: data.credits,
        semesterId: semester.id,
        courseId: course.id,
        code: code,
      },
    });
  }

  async findById(id: string): Promise<Subject> {
    const subject = await prisma.subject.findUnique({
      where: { id },
    });
    if (!subject) {
      throw new NotFoundException("Disciplina n\xE3o encontrada");
    }
    return subject;
  }
}
