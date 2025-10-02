import { Role } from "#generated/prisma";

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
  code: string;
}
