import { logger } from "#infrastructure/config/logger.js";
import { ApiResponse } from "#interfaces/response/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodTypeAny } from "zod";

export function validateData(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join("."),
        }));
        const message = "Requisição invalida".toString();

        res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, message, errorMessages));
      } else {
        logger.error("An error occurred while validating data with ZOD:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong!", null));
      }
    }
  };
}
