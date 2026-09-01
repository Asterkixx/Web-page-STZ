import { useState, useEffect } from "react";
import { C, FONTS, API_URL } from "./theme";
import Footer from "./Footer";
import SongThumb from "./SongThumb";
import { SPOTIFY_URLS } from "./spotifyUrls";
import fondo from "../Straykidsft.jpg";

const formatearNombre = (uid) =>
  uid ? uid.replace(/^usuario_/i, "").replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase()) : "Coleccionista";

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }) : null;

export default function Dedicatorias() {
  const [tarjetas, setTarjetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tarjetas`);
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

  const conDedicatoria = tarjetas
    .filter((t) => t.dedicatoria && t.desbloqueada)
    .sort((a, b) => new Date(b.fechaReclamo) - new Date(a.fechaReclamo));

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
            Dedicatorias
          </h1>
          <p style={{ margin: "0 0 16px", fontSize: "12px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase" }}>
            {conDedicatoria.length} dedicatorias de todas las canciones
          </p>
        </div>

        <main style={{ maxWidth: "700px", margin: "0 auto", padding: "0 16px" }}>
          {cargando ? (
            <div style={{ textAlign: "center", padding: "100px 20px", color: C.amarillo }}>
              <p style={{ fontSize: "16px", color: C.blancoTenue }}>Cargando dedicatorias...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.amarillo }}>
              <p>{error}</p>
            </div>
          ) : conDedicatoria.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: C.blancoTenue }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>💌</div>
              <p style={{ fontSize: "15px" }}>Aún no hay dedicatorias.</p>
              <p style={{ fontSize: "13px" }}>Las dedicatorias aparecerán aquí a medida que las personas reclamen sus tarjetas.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {conDedicatoria.map((t) => {
                const spotify = t.spotifyUrl || SPOTIFY_URLS[t.numeracion];
                return (
                <div key={t.codigoQR} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                    <SongThumb numeracion={t.numeracion} size={50} radius={10} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "14px", color: C.amarillo, fontWeight: "700" }}>
                        {t.nombreCancion}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: C.blancoTenue, textTransform: "uppercase", letterSpacing: "1px" }}>
                        {t.album}
                      </p>
                    </div>
                    {spotify && (
                      <a href={spotify} target="_blank" rel="noreferrer" style={{ color: "#1DB954", fontSize: "12px", textDecoration: "none", fontWeight: "700", flexShrink: 0 }}>
                        ▶ Escuchar
                      </a>
                    )}
                  </div>
                  <p style={{
                    margin: "0 0 10px",
                    fontSize: "15px",
                    color: "#FFFFFF",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    background: "rgba(249,190,12,0.06)",
                    border: "1px solid rgba(249,190,12,0.15)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                  }}>
                    "{t.dedicatoria}"
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontSize: "11px", color: C.blancoSuave, textTransform: "capitalize" }}>
                      💛 {formatearNombre(t.usuarioId)}
                    </span>
                    {formatearFecha(t.fechaReclamo) && (
                      <span style={{ fontSize: "10px", color: C.blancoTenue, fontFamily: "monospace" }}>
                        {formatearFecha(t.fechaReclamo)}
                      </span>
                    )}
                  </div>
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
