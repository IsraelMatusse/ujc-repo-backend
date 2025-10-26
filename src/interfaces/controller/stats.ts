import { StatsService } from "#application/services/stats";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const statsService = new StatsService();
export class StatsController {
  async getGenericStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getGenericStats();
      res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Estatisticas genericas", stats));
    } catch (error) {
      next(error);
    }
  }
}
