import { NextFunction, Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createPlaylistSchema } from "../schemas/playlistSchema";
import { z } from "zod";

const prisma = new PrismaClient();

export async function getAllPlaylists(req: Request, res: Response) {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
}

export async function getPlaylistById(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = Number(req.params.id);
  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) res.status(404).json({ error: "Playlist não encontrada" });

  res.json(playlist);
}

export async function createPlaylist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createPlaylistSchema.parse(req.body);

    await prisma.playlist.create({
      data: { name: parsed.name, userId: 1 },
    });

    res.status(201).json({ message: "Playlist criada com sucesso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }
    next(error);
  }
}

export async function updatePlaylist(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const parsed = createPlaylistSchema.parse(req.body);

    const findPlaylistById = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!findPlaylistById)
      res.status(404).json({ error: "Playlist não encontrada" });

    const playlist = await prisma.playlist.update({
      where: { id },
      data: { name: parsed.name },
    });

    res.json(playlist);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
}

export async function deletePlaylist(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = Number(req.params.id);

  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) res.status(404).json({ error: "Playlist não encontrada" });
  await prisma.playlist.delete({ where: { id } });
  res.status(204).end();
}
