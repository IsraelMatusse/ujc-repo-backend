import { FileService } from "#application/services/file.js";
import { formatFilename } from "#infrastructure/utils/dateUtils";
import { ApiResponse } from "#interfaces/response/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";

const __dirname = path.dirname(__filename);
const fileService = new FileService();
export class FileController {
  getUploadedFile(req: Request, res: Response) {
    const originalFilename = req.params.filename;
    const formattedFilename = formatFilename(originalFilename);
    const filePath = path.join(__dirname, "../../../uploads", formattedFilename);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(404).json({ message: "Ficheiro não encontrado." });
      }
    });
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const host = req.get("host");
        if (!host) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Host header is missing", null));
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const filename = req.file.filename;
        const fileUrl = `${baseUrl}/v1/uploads/${filename}`;

        const fileData = await fileService.createFile({
          createdAt: new Date(),
          designation: req.file.originalname,
          path: fileUrl,
          type: req.file.mimetype,
          updatedAt: new Date(),
        });
        const message = "Ficheiro carregado com sucesso";
        res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, message, fileData));
      } else {
        const fileNotFound = "Ficheiro nao encontrado";
        res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, fileNotFound, null));
      }
    } catch (error) {
      next(error);
    }
  }
}
