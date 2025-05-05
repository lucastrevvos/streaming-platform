import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Playlists from "./pages/Playlists";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/playlists" element={<Playlists />} />
      </Routes>
    </Router>
  );
}

export default App;
