import winston from "winston";

const date = new Date();
const fileName = `${date.toISOString().slice(0, 10)}-api.log`;

export const logger = winston.createLogger({
  format: winston.format.json(),
  level: "info",
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: `logs/${fileName}` })],
});
