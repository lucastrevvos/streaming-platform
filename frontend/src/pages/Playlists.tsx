import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type Playlist = {
  id: number;
  name: string;
};

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylist, setNewPlaylist] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await api.get("/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlaylists(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao buscar playlists");
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Minhas Playlists</h1>
      <div className="flex items-center gap-4">
        <Link to="/albums" className="text-blue-500 underline">
          Buscar Álbuns
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              setError("Token não encontrado. Faça login novamente.");
              return;
            }

            await api.post(
              "/playlists",
              { name: newPlaylist },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await api.get("/playlists", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPlaylists(response.data);
            setNewPlaylist("");
          } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao criar playlist");
          }
        }}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          value={newPlaylist}
          onChange={(e) => setNewPlaylist(e.target.value)}
          placeholder="Nome da nova playlist"
          className="border p-2 flex-1"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 rounded">
          Criar
        </button>
      </form>

      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="border p-2 rounded">
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
