import express from "express";

export interface AuthUser {
  exp: string;
  iat: string;
  userId: string;
}

export interface File {
  destination: string;
  enconding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export interface RegisterWithUserAndFile {
  file: File;
  user?: AuthUser;
}

export interface RequestWithUser extends express.Request {
  user: AuthUser;
}
