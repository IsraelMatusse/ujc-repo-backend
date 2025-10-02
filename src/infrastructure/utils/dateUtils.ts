import { BadRequestException, UnprocessableEntityException } from "#infrastructure/exceptions/defaultExceptions.js";
import { format, isValid, parse } from "date-fns";

export function convertToISODate(dateInput: Date | string) {
  if (dateInput instanceof Date) {
    return format(dateInput, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }

  const date = parse(dateInput, "yyyy-MM-dd", new Date());
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}

export function ensureValidISODate(dateInput: any): string {
  if (dateInput === null || dateInput === undefined) {
    throw new BadRequestException("Date is required");
  }

  if (dateInput instanceof Date) {
    if (!isValid(dateInput)) {
      throw new BadRequestException("Invalid Date object provided");
    }
    return format(dateInput, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }

  if (typeof dateInput === "string") {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateInput)) {
      const date = new Date(dateInput);
      if (isValid(date)) {
        return dateInput;
      }
    }

    let date = parse(dateInput, "yyyy-MM-dd", new Date());
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }

    date = parse(dateInput, "dd-MM-yyyy", new Date());
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }

    date = parse(dateInput, "dd-MM-yyyy HH:mm", new Date());
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }

    date = new Date(dateInput);
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    throw new BadRequestException(`Invalid date format: ${dateInput}. Expected format: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY HH:mm`);
  }
  throw new BadRequestException("Date must be a string in format YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY HH:mm or a Date object");
}
export function formatDateToSouthAfrica(dateInput: Date | string): string {
  if (!dateInput) {
    return "";
  }

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);

  const day = String(localDate.getUTCDate()).padStart(2, "0");
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const year = localDate.getUTCFullYear();

  const hours = String(localDate.getUTCHours()).padStart(2, "0");
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function validateDatesRange(startDate: Date, endDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    const message = "Start date cannot be in the past";
    throw new UnprocessableEntityException(message);
  }

  if (endDate < today) {
    const message = "End date cannot be in the past";

    throw new UnprocessableEntityException(message);
  }

  if (startDate > endDate) {
    const message = "Issue with the date range: Start date cannot be after end date";
    throw new UnprocessableEntityException(message);
  }
}

export function formatFilename(originalname: string): string {
  return originalname
    .replace(/\s+/g, "_") // substitui espaços por underlines
    .normalize("NFD") // decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, ""); // mantém apenas letras, números e alguns caracteres especiais
}
