import { PrismaClient } from "#generated/prisma";
import { ApiResponse } from "#interfaces/response/apiResponse.js";
import { Request, Response, NextFunction } from "express"; 
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const secretKey = process.env.TOKEN_SECRET as string;

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = (req.headers as any).authorization;
    const authorizationToken = authHeader && authHeader.split(" ")[1];

    if (!authorizationToken) {
      res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Token não fornecido", null));
      return;
    }
    const decodedToken = jwt.verify(authorizationToken, secretKey) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });

    if (!user) {
      res.status(StatusCodes.FORBIDDEN).json(new ApiResponse(StatusCodes.FORBIDDEN, "Usuário não encontrado", null));
      return;
    }

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Token revogado", error));
    return;
  }
}
