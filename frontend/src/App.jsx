import { Routes, Route } from "react-router-dom";
import Bienvenida from "./Bienvenida";
import AlbumPrincipal from "./components/AlbumPrincipal";
import PantallaEscanear from "./PantallaEscanear";
import PantallaAdmin from "./PantallaAdmin";
import ValidarQR from "./components/ValidarQR";
import PlaylistDesbloqueadas from "./components/PlaylistDesbloqueadas";
import Dedicatorias from "./components/Dedicatorias";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"              element={<Bienvenida />} />
        <Route path="/album"         element={<AlbumPrincipal />} />
        <Route path="/desbloqueadas" element={<PlaylistDesbloqueadas />} />
        <Route path="/dedicatorias"  element={<Dedicatorias />} />
        <Route path="/escanear"      element={<PantallaEscanear />} />
        <Route path="/admin"         element={<PantallaAdmin />} />
        <Route path="/validar/:codigoQR" element={<ValidarQR />} />
        
      </Routes>
    </>
  );
}
