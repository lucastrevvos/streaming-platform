import { Router } from "express";
import { getAlbumsByArtist } from "../controllers/externalController";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/albums/:artist", getAlbumsByArtist);

export default router;
