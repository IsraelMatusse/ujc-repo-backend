import { AuthService } from "#application/services/auth";
import { AuthLoginData } from "#interfaces/request/auth";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { ApiResponseWithToken } from "#interfaces/response/apiResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "#application/services/user";

const authService = new AuthService();
export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as AuthLoginData;
      const result = await authService.autenticateUser(data);
      const message = "Usuário autenticado com sucesso";
      res.status(StatusCodes.OK).json(new ApiResponseWithToken(StatusCodes.OK, result.token, message, result.user));
    } catch (error) {
      next(error);
    }
  }
}
