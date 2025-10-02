import { inject, injectable } from "tsyringe";
import { UserService } from "./user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthLoginData } from "#interfaces/request/auth";
import { BadCredentialsException } from "#infrastructure/exceptions/defaultExceptions";
import { UserResponse } from "#interfaces/response/user";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";

const userservice = new UserService();
export class AuthService {
  generateAccessToken(userId: string): string {
    const tokenSecret = process.env.TOKEN_SECRET ?? "secret";
    return jwt.sign({ userId: userId }, tokenSecret, { expiresIn: "48h" });
  }

  async autenticateUser(data: AuthLoginData): Promise<{ token: string; user: UserResponse }> {
    const user = await userservice.findByEmail(data.email);

    const isPasswordValid = user.password ? await bcrypt.compare(data.password, user.password) : false;

    if (!isPasswordValid) {
      throw new BadCredentialsException("Credenciais inválidas");
    }

    const token = this.generateAccessToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName ?? "",
        email: user.email,
        status: user.status,
        createdAt: formatDateToSouthAfrica(user.createdAt),
        updatedAt: formatDateToSouthAfrica(user.updatedAt),
        role: user.role,
        code: user.code,
      },
    };
  }
}
