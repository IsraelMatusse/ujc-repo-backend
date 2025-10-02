import { UnprocessableEntityException } from "#infrastructure/exceptions/defaultExceptions.js";
import { FileFilterCallback } from "#interfaces/request/file";
import * as fs from "fs";
import multer, { StorageEngine } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(__dirname, "../../../uploads");

const ensureUploadDirectoryExists = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirectoryExists();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const formattedName = file.originalname
      .replace(/\s+/g, "_") // substitui espaços por underlines
      .normalize("NFD") // decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-zA-Z0-9._-]/g, ""); // mantém apenas letras, números e alguns caracteres especiais

    // Adicionar timestamp para evitar conflitos de nome
    const finalName = `${timestamp}_${formattedName}`;
    cb(null, finalName);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "video/mp4",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new UnprocessableEntityException("File type not allowed, allowed types: pdf, png/jpg, ppt, word, pptx, xlsx e mp4"), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1, // Apenas um arquivo
    fields: 10, // Máximo de campos
    fieldSize: 1 * 1024 * 1024, // 1MB por campo
  },
  storage: storage,
});

// Wrapper para melhor tratamento de erros
export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
  const multerSingle = upload.single("file");

  // Log da requisição para debug
  console.log("Upload attempt:", {
    contentType: req.headers["content-type"],
    contentLength: req.headers["content-length"],
    url: req.url,
    method: req.method,
  });

  // Verificar se é uma requisição multipart válida
  const contentType = req.headers["content-type"];
  if (contentType && contentType.startsWith("multipart/form-data")) {
    if (!contentType.includes("boundary=")) {
      console.error("Multipart request without boundary");
      return res.status(400).json({
        error: "Requisição multipart inválida",
        details: "Content-Type deve incluir boundary para multipart/form-data",
      });
    }
  }

  multerSingle(req, res, (err: any) => {
    if (err) {
      console.error("Multer error:", {
        message: err.message,
        code: err.code,
        field: err.field,
      });

      // Tratar diferentes tipos de erro do Multer
      if (err.message && err.message.includes("Boundary not found")) {
        return res.status(400).json({
          error: "Formato multipart inválido",
          details: "Boundary não encontrado no Content-Type. Verifique se está enviando como multipart/form-data",
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
          details: "Use o campo 'file' para enviar o arquivo",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "Muitos arquivos",
          details: "Apenas um arquivo é permitido por requisição",
        });
      }

      // Para erros de validação de tipo de arquivo
      if (err instanceof UnprocessableEntityException) {
        return res.status(422).json({
          error: "Tipo de arquivo não permitido",
          details: err.message,
        });
      }

      // Para outros erros do multer, não crashar a aplicação
      return res.status(400).json({
        error: "Erro no processamento do arquivo",
        details: err.message || "Erro desconhecido durante upload",
      });
    }

    // Log de sucesso
    if (req.file) {
      console.log("File uploaded successfully:", {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    }

    next();
  });
};