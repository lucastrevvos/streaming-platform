import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Album = {
  albumName: string;
  coverUrl: string;
};

export default function Albums() {
  const [artist, setArtist] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAlbums([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/external/albums/${encodeURIComponent(artist)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlbums(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao buscar álbuns");
    }
  };

  return (
    <div className="p-4">
      <Link to="/playlists" className="text-blue-500 underline">
        Voltar para Playlists
      </Link>

      <h1 className="text-2xl font-bold mb-4">Buscar Álbuns</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Nome do artista"
          className="border p-2 flex-1"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Buscar
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <div key={index} className="border rounded p-2">
            <img
              src={album.coverUrl}
              alt={album.albumName}
              className="w-full"
            />
            <p className="mt-2 text-center">{album.albumName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
