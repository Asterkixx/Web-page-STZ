import { useState, useEffect } from "react";
import { C, FONTS, API_URL } from "./theme";
import Footer from "./Footer";
import SongThumb from "./SongThumb";
import { SPOTIFY_URLS } from "./spotifyUrls";
import fondo from "../Straykidsft.jpg";

export default function PlaylistDesbloqueadas() {
  const [tarjetas, setTarjetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tarjetas?desbloqueada=true`);
        const data = await res.json();
        setTarjetas(Array.isArray(data.tarjetas) ? data.tarjetas : []);
      } catch {
        setError("No se pudo conectar con el backend");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const desbloqueadas = tarjetas.filter((t) => t.desbloqueada);

  return (
    <>
      <div style={{
        minHeight: "100vh",
        backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.99)), url(${fondo})`,
        backdropFilter: "blur(20px)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: C.blanco,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        paddingBottom: "80px",
      }}>
        <header style={{ background: "rgba(0, 0, 0, 0)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: "400px", margin: "0 auto", padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            <img src="/skz-logo.png" alt="SKZ Virtual Album" style={{ height: "60px", width: "auto", objectFit: "contain", display: "block" }} />
          </div>
        </header>

        <div style={{ padding: "16px", textAlign: "center" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "900", color: C.amarillo, fontFamily: FONTS.titulo, letterSpacing: "2px", textTransform: "uppercase" }}>
            Canciones desbloqueadas
          </h1>
          <p style={{ margin: "0 0 16px", fontSize: "12px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase" }}>
            {desbloqueadas.length} canciones · Escucha cada una en Spotify
          </p>
        </div>

        <main style={{ maxWidth: "700px", margin: "0 auto", padding: "0 16px" }}>
          {cargando ? (
            <div style={{ textAlign: "center", padding: "100px 20px", color: C.amarillo }}>
              <p style={{ fontSize: "16px", color: C.blancoTenue }}>Cargando tu playlist...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.amarillo }}>
              <p>{error}</p>
            </div>
          ) : desbloqueadas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: C.blancoTenue }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
              <p style={{ fontSize: "15px" }}>Aún no has desbloqueado ninguna canción.</p>
              <p style={{ fontSize: "13px" }}>Escanea un código QR para reclamar tu primera tarjeta.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {desbloqueadas.map((t) => {
                const spotify = t.spotifyUrl || SPOTIFY_URLS[t.numeracion];
                return (
                <div key={t.codigoQR} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                }}>
                  <SongThumb numeracion={t.numeracion} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.nombreCancion}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: C.blancoTenue, textTransform: "uppercase", letterSpacing: "1px" }}>
                      {t.album}
                    </p>
                  </div>
                  {spotify ? (
                    <a
                      href={spotify}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#1DB954",
                        borderRadius: "20px",
                        padding: "8px 14px",
                        color: "#000",
                        fontWeight: "700",
                        fontSize: "12px",
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: "15px" }}>▶</span> Spotify
                    </a>
                  ) : (
                    <span style={{ fontSize: "10px", color: C.blancoTenue, flexShrink: 0 }}>Sin enlace</span>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
