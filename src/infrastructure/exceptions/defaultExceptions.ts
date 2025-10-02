import { HttpException } from "./types";
import { StatusCodes } from "http-status-codes";

export class BadRequestException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
export class ConflictException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.CONFLICT, message);
  }
}

export class InternalServerError extends HttpException<void> {
  constructor() {
    super(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong! Our team is working to solve this as soon as possible.");
  }
}

export class NotFoundException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class UnprocessableEntityException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message);
  }
}

export class BadCredentialsException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class ForbiddenException extends HttpException<void> {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, message);
  }
}