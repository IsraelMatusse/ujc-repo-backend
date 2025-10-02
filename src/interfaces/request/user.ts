import { Role } from "#generated/prisma";

export interface UserCreationData {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserUpdatePasswordData {
  confirmPassword: string;
  password: string;
}

export interface UpdateUserEmailData {
  email: string;
}
