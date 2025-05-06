import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";
import Albums from "./pages/Albums";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/albums" element={<Albums />} />
      </Route>
    </Routes>
  );
}

export default App;
