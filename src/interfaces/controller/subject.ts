import { SubjectService } from "#application/services/subject";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const subjectService = new SubjectService();
export class SubjectController {
  async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      await subjectService.createSubject(data);
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Disciplina criada com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async getAllSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await subjectService.findAll();
      res.json(new ApiResponse(StatusCodes.OK, "Disciplinas encontradas", subjects));
    } catch (error) {
      next(error);
    }
  }

  async getSubjectsByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.courseId;
      const subjects = await subjectService.findByCourse(courseId);
      res.json(new ApiResponse(StatusCodes.OK, "Disciplinas encontradas", subjects));
    } catch (error) {
      next(error);
    }
  }

  async getSubjectsBySemester(req: Request, res: Response, next: NextFunction) {
    try {
      const semesterId = req.params.semesterId;
      const subjects = await subjectService.findBySemester(semesterId);
      res.json(new ApiResponse(StatusCodes.OK, "Disciplinas encontradas", subjects));
    } catch (error) {
      next(error);
    }
  }
}
