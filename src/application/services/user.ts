import { ConflictException, NotFoundException, UnprocessableEntityException } from "#infrastructure/exceptions/defaultExceptions";
import { AuthUser } from "#infrastructure/types";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";
import { EmailData, EmailSendDTO, UpdateUserEmailData, UserCreationData, UserUpdatePasswordData } from "#interfaces/request/user";
import bcrypt from "bcrypt";
import { UserResponse } from "#interfaces/response/user";
import { Prisma, PrismaClient, User } from "#generated/prisma";
import { formatDateToSouthAfrica } from "#infrastructure/utils/dateUtils";

const prisma = new PrismaClient();
export class UserService {
  async existsByEmail(email: string): Promise<boolean> {
    return !!(await prisma.user.findUnique({
      where: { email },
    }));
  }

  async createUser(userData: UserCreationData): Promise<{ password: string; user: User }> {
    if (await this.existsByEmail(userData.email)) {
      throw new ConflictException("Email introduzido j\xE1 se encontra em uso.");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const code = generateAleatoryCodes();
    const newUser = await prisma.user.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        code: code,
      },
    });
    return { password: userData.password, user: newUser };
  }

  async getOnlineUser(authUser: AuthUser): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      throw new NotFoundException("Usu\xE1rio n\xE3o encontrado.");
    }

    return user;
  }

  async getOnlineUserDetails(authUser: AuthUser): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      throw new NotFoundException("Usu\xE1rio n\xE3o encontrado.");
    }
    return {
      id: user.id,
      fullName: user.fullName ?? "",
      email: user.email,
      status: user.status,
      createdAt: formatDateToSouthAfrica(user.createdAt),
      updatedAt: formatDateToSouthAfrica(user.updatedAt),
      role: user.role,
      code: user.code,
    };
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();

    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName ?? "",
      email: user.email,
      status: user.status,
      createdAt: formatDateToSouthAfrica(user.createdAt),
      updatedAt: formatDateToSouthAfrica(user.updatedAt),
      role: user.role,
      code: user.code,
    }));
  }

  async updateUserPassword(authUser: AuthUser, passwordData: UserUpdatePasswordData): Promise<void> {
    const user = await this.getOnlineUser(authUser);

    if (user.password != (await bcrypt.hash(passwordData.currentPassword, 10))) {
      throw new UnprocessableEntityException("Senha atual incorreta");
    }

    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
    await prisma.user.update({
      where: { id: user?.id },
      data: { password: hashedPassword },
    });
  }

  async updateUserEmail(data: UpdateUserEmailData, authUser: AuthUser) {
    const user = await this.getOnlineUser(authUser);
    if (await this.existsByEmailAndIdNot(data.email, user.id)) {
      throw new ConflictException("Usuário com este email já existe");
    }
    user.email = data.email;
    user.updatedAt = new Date();
    await this.update(user);
  }

  async existsByEmailAndIdNot(email: string, id: string): Promise<boolean> {
    return !!(await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    }));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("Usu\xE1rio n\xE3o encontrado.");
    }
    return user;
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        updatedAt: user.updatedAt,
        role: user.role,
        code: user.code,
        password: user.password,
      },
    });
  }

  async updateEmail(data: UpdateUserEmailData) {
    const user = await this.findByEmail(data.email);

    if (data.email != user.email) {
      if (await this.existsByEmail(data.email)) {
        throw new ConflictException("Email ja em uso");
      }
    }
    await prisma.user.update({
      where: {
        id: user.id,
        status: true,
      },
      data: {
        email: data.email,
      },
    });
  }

  async forgotPassword(emailData: EmailData) {
    const user = await this.findByEmail(emailData.email);
  }

  async mapEmailToUsers<T extends EmailData>(data: T, subject: string, text: string): Promise<EmailSendDTO> {
    return {
      emailTo: data.email,
      subject: subject,
      text: text,
    };
  }
}
