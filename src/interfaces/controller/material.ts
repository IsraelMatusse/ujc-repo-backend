import { MaterialService } from "#application/services/material";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "#interfaces/response/apiResponse";
const materialService = new MaterialService();

export class MaterialController {
  async createMaterial(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      await materialService.createMaterial(data);
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Material criado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async getAllMaterials(req: Request, res: Response, next: NextFunction) {
    try {
      const materials = await materialService.getMaterials();
      res.json(new ApiResponse(StatusCodes.OK, "Materiais encontrados", materials));
    } catch (error) {
      next(error);
    }
  }

  async getMaterialsBySubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectId = req.params.subjectId;
      const materials = await materialService.getMaterialsBySubject(subjectId);
      res.json(new ApiResponse(StatusCodes.OK, "Materiais encontrados", materials));
    } catch (error) {
      next(error);
    }
  }
}
