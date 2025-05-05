import { useEffect, useState } from "react";
import axios from "axios";

type Playlist = {
  id: number;
  name: string;
};

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token não encontrado. Faça login novamente.");
          return;
        }

        const response = await axios.get("http://localhost:3000/playlists", {
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
      <h1 className="text-2xl font-bold mb-4">Minhas Playlists</h1>
      {error && <p className="text-red-500">{error}</p>}
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
