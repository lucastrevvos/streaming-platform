import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({ errors: err.errors });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expirado" });
    return;
  }

  res.status(500).json({ error: "Erro interno do servidor" });
  return;
}
