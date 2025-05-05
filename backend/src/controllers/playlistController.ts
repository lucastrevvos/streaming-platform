import { NextFunction, Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createPlaylistSchema } from "../schemas/playlistSchema";
import { AppError } from "../errors/AppError";

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

  if (!playlist) {
    throw new AppError("Playlist não encontrada", 404);
  }

  res.json(playlist);
}

export async function createPlaylist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createPlaylistSchema.parse(req.body);

    const userId = req.user!.id;

    const playlist = await prisma.playlist.create({
      data: { name: parsed.name, userId },
    });

    res.status(201).json(playlist);
  } catch (error) {
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

    if (!findPlaylistById) {
      throw new AppError("Playlist não encontrada", 404);
    }

    const playlist = await prisma.playlist.update({
      where: { id },
      data: { name: parsed.name },
    });

    res.json(playlist);
  } catch (error) {
    next(error);
  }
}

export async function deletePlaylist(
  req: Request<{ id: string }>,
  res: Response
) {
  const id = Number(req.params.id);

  const playlist = await prisma.playlist.findUnique({ where: { id } });

  if (!playlist) {
    throw new AppError("Playlist não encontrada", 404);
  }

  await prisma.playlist.delete({ where: { id } });
  res.status(204).end();
}
