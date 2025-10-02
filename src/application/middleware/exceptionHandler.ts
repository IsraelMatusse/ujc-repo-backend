import { logger } from "#infrastructure/config/logger.js";
import { HttpException } from "#infrastructure/exceptions/types.js";
import { NextFunction, Request, Response } from "express";
export function exceptionHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  logger.error("Error caught by middleware:", error);

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      data: error.data,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
}
