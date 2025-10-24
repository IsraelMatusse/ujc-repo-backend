import { SemesterService } from "#application/services/semester";
import { SemesterCreationData } from "#interfaces/request/semester";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const semesterService = new SemesterService();
export class SemesterController {
  async createSemester(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as SemesterCreationData;
      await semesterService.createSemester(data);
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Semestre criado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async updateSenester(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body as SemesterCreationData;
      await semesterService.updateSemester(id, data);
      res.json(new ApiResponse(StatusCodes.OK, "Semestre atualizado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async getAllSemesters(req: Request, res: Response, next: NextFunction) {
    try {
      const semesters = await semesterService.getSemesters();
      res.json(new ApiResponse(StatusCodes.OK, "Semestres encontrados", semesters));
    } catch (error) {
      next(error);
    }
  }

  async getSemestersByYear(req: Request, res: Response, next: NextFunction) {
    try {
      const yearId = req.params.yearId;
      const semesters = await semesterService.getSemestersByYear(yearId);
      res.json(new ApiResponse(StatusCodes.OK, "Semestres encontrados", semesters));
    } catch (error) {
      next(error);
    }
  }
}
