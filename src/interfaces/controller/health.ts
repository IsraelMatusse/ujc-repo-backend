import { ApiResponse } from "#interfaces/response/apiResponse";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "tsyringe";

@injectable()
export class HealthController {
  checkApiHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const message = "The server is healthy";
      res.json(new ApiResponse(StatusCodes.OK, message, null));
    } catch (error) {
      next(error);
    }
  }
}
