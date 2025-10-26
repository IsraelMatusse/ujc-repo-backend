import { PrismaClient } from "#generated/prisma";
import { GenereicStats } from "#interfaces/response/stats";

const prisma = new PrismaClient();

export class StatsService {
  async getGenericStats(): Promise<GenereicStats> {
    const users = prisma.user.count({
      where: {
        status: true,
      },
    });
    const materials = prisma.material.count({
      where: {
        status: true,
      },
    });
    const courses = prisma.course.count({
      where: {
        status: true,
      },
    });
    const subjects = prisma.subject.count({
      where: {
        status: true,
      },
    });

    const [usersCount, materialsCount, coursesCount, subjectsCount] = await Promise.all([users, materials, courses, subjects]);

    return {
      users: usersCount,
      materials: materialsCount,
      courses: coursesCount,
      subjects: subjectsCount,
    };
  }
}
