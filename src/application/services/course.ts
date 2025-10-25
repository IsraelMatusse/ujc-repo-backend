import { Course, PrismaClient } from "#generated/prisma";
import { ConflictException, NotFoundException } from "#infrastructure/exceptions/defaultExceptions";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";
import { CourseRequest } from "#interfaces/request/course";
import { CourseDetails, CourseResponse, CourseWithSubjects } from "#interfaces/response/course";
import { YearWithSemester } from "#interfaces/response/year";

const prisma = new PrismaClient();
export class CourseService {
  async getAllCourses(): Promise<CourseResponse[]> {
    const courses = await prisma.course.findMany({
      where: { status: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      status: course.status,
      createdAt: formatDateToSouthAfrica(course.createdAt),
    }));
  }

  async updateCourse(id: string, data: CourseRequest) {
    const course = await this.findById(id);
    if (course.name !== data.name) {
      if (await this.existsByName(data.name)) {
        throw new ConflictException("Curso com este nome j\xE1 existe");
      }
    }
    await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  async getCoursesWithSubjects(): Promise<CourseWithSubjects[]> {
    const courses = await prisma.course.findMany({
      where: { status: true, deletedAt: null },
      include: {
        Subject: {
          where: { status: true, deletedAt: null },
          include: { semester: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      status: course.status,
      createdAt: formatDateToSouthAfrica(course.createdAt),
      subjects: course.Subject.map((subject) => ({
        id: subject.id,
        name: subject.name,
        credits: subject.credits ?? 0,
        courseId: subject.courseId,
        semesterId: subject.semesterId,
        createdAt: formatDateToSouthAfrica(subject.createdAt),
        course: course.name,
        semester: subject.semester?.name ?? "",
      })),
    }));
  }

  async getCourseDetailsById(id: string): Promise<CourseDetails> {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        Subject: {
          where: { status: true, deletedAt: null },
          include: {
            semester: {
              include: {
                year: true,
              },
            },
            Material: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Curso não encontrado");
    }

    // Extrair e organizar os anos e semestres
    const yearsMap = new Map<string, YearWithSemester>();

    course.Subject.forEach((subject) => {
      const semester = subject.semester;
      const year = semester?.year;

      if (year) {
        // Se o ano ainda não estiver no mapa, adiciona
        if (!yearsMap.has(year.id)) {
          yearsMap.set(year.id, {
            name: year.name,
            order: year.order ?? 0,
            code: year.code ?? "",
            semesters: [],
          });
        }

        const yearEntry = yearsMap.get(year.id)!;

        // Adiciona o semestre se ainda não estiver no ano
        if (semester && !yearEntry.semesters.some((s) => s.id === semester.id)) {
          yearEntry.semesters.push({
            id: semester.id,
            name: semester.name,
            code: semester.code ?? "",
            createdAt: semester.createdAt,
            yearId: semester.yearId,
            status: semester.status,
            updatedAt: semester.updatedAt,
            deletedAt: null,
          });
        }
      }
    });

    return {
      id: course.id,
      name: course.name,
      code: course.code,
      status: course.status,
      createdAt: formatDateToSouthAfrica(course.createdAt),

      subjects: course.Subject.map((subject) => ({
        id: subject.id,
        name: subject.name,
        credits: subject.credits ?? 0,
        courseId: subject.courseId,
        semesterId: subject.semesterId,
        createdAt: formatDateToSouthAfrica(subject.createdAt),
        course: course.name,
        semester: subject.semester?.name ?? "",
      })),

      years: Array.from(yearsMap.values()).sort((a, b) => a.order - b.order),

      material: course.Subject.flatMap((subject) =>
        subject.Material.map((material) => ({
          id: material.id,
          file: material.file,
          author: material.author ?? "",
          title: material.title,
          description: material.description ?? "",
          type: material.type,
          createdAt: formatDateToSouthAfrica(material.createdAt),
          status: material.status,
          subject: subject.name,
          semester: subject.semester?.name ?? "",
          year: subject.semester?.year?.name ?? "",
        })),
      ),
    };
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
