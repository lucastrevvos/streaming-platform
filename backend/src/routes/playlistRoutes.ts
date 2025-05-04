import { Router } from "express";
import {
  getAllPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlistController";

const router = Router();

router.get("/", getAllPlaylists);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

export default router;
