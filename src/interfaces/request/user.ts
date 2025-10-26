import { Role } from "#generated/prisma";

export interface UserCreationData {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface UserUpdatePasswordData {
  newPassword: string;
  currentPassword: string;
}

export interface UpdateUserEmailData {
  email: string;
}

export interface EmailData {
  email: string;
}
export type OtpValidateDto = {
  otp: string;
};
export type UpdatePassword = {
  password: string;
};
export type ForgotPasswordDto = {
  email: string;
};
export type OtpCreateDto = {
  email: string;
};
export interface EmailSendDTO {
  emailTo: string;
  subject: string;
  text: string;
};