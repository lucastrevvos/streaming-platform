import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { AppError } from "../errors/AppError";

export async function getAlbumsByArtist(
  req: Request<{ artist: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const artist = req.params.artist;

    console.log("Recebendo artist:", req.params.artist);

    if (!artist) throw new AppError("Artista não informado", 400);

    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: artist,
        entity: "album",
        limit: 10,
      },
    });

    const results = response.data.results;

    if (!results || !Array.isArray(results)) {
      return next(new AppError("Nenhum resultado válido da API externa", 502));
    }

    const albums = response.data.results.map((album: any) => ({
      albumName: album.collectionName,
      coverUrl: album.artworkUrl100,
    }));

    res.json(albums);
  } catch (error) {
    console.log("Erro na chamada axios:", error);
    next(error);
  }
}
