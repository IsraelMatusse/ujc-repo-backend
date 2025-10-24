
import { AuthUser, RequestWithUser } from "#infrastructure/types/index.js";
import { ApiResponse } from "#interfaces/response/apiResponse.js";
import { NextFunction,  Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";


function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (token == null) {
    res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Token not found in headers!", null));
    return;
  }

  console.log("token", token);
  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: unknown, user: AuthUser) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN).json(new ApiResponse(StatusCodes.FORBIDDEN, "Token is invalid!", null));
      return;
    }
    req.user = user;
    next();
  });
}

export { authenticateToken };
