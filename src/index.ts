import "reflect-metadata";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { exceptionHandlerMiddleware } from "#application/middleware/exceptionHandler";
import cors, { CorsOptions } from "cors";
import { logger } from "#infrastructure/config/logger";
import routes from "#application/routes/v1";
const app = express();
dotenv.config();

const corsOptions: CorsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  origin: "*",
};

app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (antes das rotas principais)
app.get("/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.APP_VERSION || "1.0.0",
  });
});

// Rotas principais
app.use("/v1", routes);

// Middleware de tratamento de erros (DEPOIS das rotas)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught by error handler:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    url: req.url,
    method: req.method,
    headers: req.headers,
  });

  // Log do erro
  logger.error("Error caught by middleware", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    url: req.url,
    method: req.method,
  });

  // Tratar erros específicos do Multer
  if (err.message && err.message.includes("Boundary not found")) {
    return res.status(400).json({
      error: "Formato multipart inválido - boundary não encontrado",
      details: "Verifique se o Content-Type está correto para upload de arquivos",
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Arquivo muito grande",
      details: "Tamanho máximo permitido: 100MB",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      error: "Campo de arquivo inesperado",
      details: "Verifique se o nome do campo de arquivo está correto ('file')",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      error: "Muitos arquivos enviados",
      details: "Apenas um arquivo é permitido por vez",
    });
  }

  // Erros de validação de tipo de arquivo
  if (err.message && err.message.includes("File type not allowed")) {
    return res.status(422).json({
      error: "Tipo de arquivo não permitido",
      details: err.message,
    });
  }

  // Chamar o handler original para outros erros
  exceptionHandlerMiddleware(err, req, res, next);
});

// Capturar erros não tratados para evitar crashes da aplicação
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  logger.error("Uncaught Exception:", {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });
  // NÃO fazer process.exit() para manter a aplicação rodando
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  logger.error("Unhandled Rejection:", {
    reason: reason,
    promise: promise,
  });
  // NÃO fazer process.exit() para manter a aplicação rodando
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

const port = process.env.PORT ?? "4000";
const server = app.listen(port, () => {
  logger.info(`EVENTS_MEF_API: App listening on port ${port}. Started at ${new Date().toDateString()}`);
  console.log(`EVENTS_MEF_API: App listening on port ${port}`);
});

// Configurar timeout do servidor
server.timeout = 120000; // 2 minutos

export { app };