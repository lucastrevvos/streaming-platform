import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/authSchema";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (!user) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const passwordMatch = await bcrypt.compare(parsed.password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: "Erro interno" });
    return;
  }
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = loginSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const emailExists = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    if (emailExists) {
      res.status(400).json({ message: "E-mail já cadastrado" });
      return;
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
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    res.status(500).json({ error: "Erro interno" });
  }
}
