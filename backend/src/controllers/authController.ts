import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/authSchema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatch = await bcrypt.compare(parsed.password, user.password);

    if (!passwordMatch) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const emailExists = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (emailExists) {
      throw new AppError("E-mail já cadastrado", 400);
    }

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", userId: user.id });
  } catch (error) {
    next(error);
  }
}
