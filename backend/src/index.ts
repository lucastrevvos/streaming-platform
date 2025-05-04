import express from "express";
import playlistRoutes from "./routes/playlistRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/playlists", playlistRoutes);

app.get("/", (req, res) => {
  res.send("API online");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
