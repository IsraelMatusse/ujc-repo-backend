import { UserService } from "#application/services/user";
import { UserCreationData } from "#interfaces/request/user";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "#interfaces/response/apiResponse";
import { RequestWithUser } from "#infrastructure/types";
import { AuthService } from "#application/services/auth";

const userService = new UserService();
const authService = new AuthService();
export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as UserCreationData;
      const user = await userService.createUser(data);
      const userData = await authService.autenticateUser({ email: user.user.email, password: data.password });
      res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "Usuário criado com sucesso", userData));
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(new ApiResponse(StatusCodes.OK, "Usuários encontrados", users));
    } catch (error) {
      next(error);
    }
  }

  async getOnlineUser(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Usuário não autenticado", null));
        return;
      }
      const onlineUser = await userService.getOnlineUserDetails(req.user);
      res.json(new ApiResponse(StatusCodes.OK, "Usuário online encontrado", onlineUser));
    } catch (error) {
      next(error);
    }
  }

  async updateUserPassword(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Usuário não autenticado", null));
        return;
      }
      const data = req.body;
      await userService.updateUserPassword(req.user, data);
      res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Senha atualizada com sucesso", null));
    } catch (error) {
      next(error);
    }
  }

  async updateUserEmail(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, "Usuário não autenticado", null));
        return;
      }
      const data = req.body;
      await userService.updateUserEmail(data, req.user);
      res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Email atualizado com sucesso", null));
    } catch (error) {
      next(error);
    }
  }
}
