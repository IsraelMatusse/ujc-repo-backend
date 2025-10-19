import { PrismaClient, Subject } from "#generated/prisma";
import { ConflictException, NotFoundException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";
import { SubjectRequestData } from "#interfaces/request/subject";
import { SubjectResponse } from "#interfaces/response/subject";
import { CourseService } from "./course";
import { SemesterService } from "./semester";

const prisma = new PrismaClient();
const semesterService = new SemesterService();
const courseService = new CourseService();
export class SubjectService {
  async existsByNameAndCourse(name: string, courseId: string): Promise<boolean> {
    return !!(await prisma.subject.findFirst({
      where: { name, courseId },
    }));
  }

  async createSubject(data: SubjectRequestData) {
    const semester = await semesterService.findById(data.semesterId);
    const course = await courseService.findById(data.courseId);

    if (await this.existsByNameAndCourse(data.name, data.courseId)) {
      throw new ConflictException("Disciplina com este nome j\xE1 existe");
    }

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

  async findDetailsById(id: string): Promise<SubjectResponse> {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        course: true,
        semester: true,
      },
    });

    if (!subject) {
      throw new NotFoundException("Disciplina n\xE3o encontrada");
    }

    return {
      id: subject.id,
      name: subject.name,
      credits: subject.credits ?? 0,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
      createdAt: formatDateToSouthAfrica(subject.createdAt),
      course: subject.course.name,
      semester: subject.semester.name,
    };
  }

  async findAll(): Promise<SubjectResponse[]> {
    const subjects = await prisma.subject.findMany({
      where: { status: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        course: true,
        semester: true,
      },
    });
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      credits: subject.credits ?? 0,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
      createdAt: formatDateToSouthAfrica(subject.createdAt),
      course: subject.course.name,
      semester: subject.semester.name,
    }));
  }

  async findByCourse(courseId: string): Promise<SubjectResponse[]> {
    const subjects = await prisma.subject.findMany({
      where: { courseId, status: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        course: true,
        semester: true,
      },
    });
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      credits: subject.credits ?? 0,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
      createdAt: formatDateToSouthAfrica(subject.createdAt),
      course: subject.course.name,
      semester: subject.semester.name,
    }));
  }

  async findBySemester(semesterId: string): Promise<SubjectResponse[]> {
    const subjects = await prisma.subject.findMany({
      where: { semesterId, status: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        course: true,
        semester: true,
      },
    });
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      credits: subject.credits ?? 0,
      courseId: subject.courseId,
      semesterId: subject.semesterId,
      createdAt: formatDateToSouthAfrica(subject.createdAt),
      course: subject.course.name,
      semester: subject.semester.name,
    }));
  }
}
