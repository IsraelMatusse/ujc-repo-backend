import { YearService } from "#application/services/year";
import { YearCreationData } from "#interfaces/request/year";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const yearService = new YearService();
export class YearController {
  async createYear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as YearCreationData;
      await yearService.createYear(data);
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Ano criado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async getAllYears(req: Request, res: Response, next: NextFunction) {
    try {
      const years = await yearService.getYears();
      res.json(new ApiResponse(StatusCodes.OK, "Anos encontrados", years));
    } catch (error) {
      next(error);
    }
  }

  async updateYear(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body as YearCreationData;
      await yearService.updateYear(id, data);
      res.json(new ApiResponse(StatusCodes.OK, "Ano atualizado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }
}
