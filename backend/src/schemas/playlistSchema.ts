import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "O nome da playlist é obrigatório"),
});
