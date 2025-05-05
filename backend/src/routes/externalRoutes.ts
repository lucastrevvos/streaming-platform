import { Router } from "express";
import { getAlbumsByArtist } from "../controllers/externalController";

const router = Router();

router.get("/albums/:artist", getAlbumsByArtist);

export default router;
