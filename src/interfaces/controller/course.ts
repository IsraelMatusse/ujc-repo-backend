import { CourseService } from "#application/services/course";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const courseServe = new CourseService();

export class CourseController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      await courseServe.createCourse(data);
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Curso criado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseServe.getCoursesWithSubjects();
      res.json(new ApiResponse(StatusCodes.OK, "Cursos encontrados", courses));
    } catch (error) {
      next(error);
    }
  }

  async getCourseDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      const courseDetails = await courseServe.getCourseDetailsById(courseId);
      res.json(new ApiResponse(StatusCodes.OK, "Detalhes do curso encontrados", courseDetails));
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      const data = req.body;
      await courseServe.updateCourse(courseId, data);
      res.json(new ApiResponse(StatusCodes.OK, "Curso atualizado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }
}
