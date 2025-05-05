import express from "express";
import playlistRoutes from "./routes/playlistRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import externalRoutes from "./routes/externalRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/playlists", playlistRoutes);

app.use("/external", externalRoutes);

app.get("/", (req, res) => {
  res.send("API online");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
