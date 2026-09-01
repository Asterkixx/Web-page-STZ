import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FONTS } from "./theme";
import { SPOTIFY_URLS } from "./spotifyUrls";

export default function ModalTarjeta({ tarjeta, onCerrar, userId }) {
  const esMia = tarjeta?.usuarioId === userId;
  const bloqueada = !tarjeta?.desbloqueada;
  const [imgError, setImgError] = useState(false);

  // Reiniciar el estado de error si cambia la tarjeta
  useEffect(() => {
    setImgError(false);
  }, [tarjeta]);

  const numeroLimpio = parseInt(tarjeta?.numeracion, 10);
  const rutaFoto = !isNaN(numeroLimpio) ? `/tarjetas/${numeroLimpio}.jpg` : "";
  const spotifyUrl = tarjeta?.spotifyUrl || (!isNaN(numeroLimpio) ? SPOTIFY_URLS[numeroLimpio] : null);

  const fechaFormateada = tarjeta?.fechaReclamo
    ? new Date(tarjeta.fechaReclamo).toLocaleDateString("es-CO", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const nombreUsuario = tarjeta?.usuarioId
    ? tarjeta.usuarioId.replace("user_", "").replace(/_/g, " ")
    : null;

  // Renderizar usando el nodo destino en createPortal
  return createPortal(
    <div
      onClick={onCerrar}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        padding: "16px",
        boxSizing: "border-box",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg, #1a0d0d59, #2b0b0b44)",
          border: `0px solid ${bloqueada ? "rgba(255,255,255,0.1)" : "rgba(249,190,12,0.4)"}`,
          borderRadius: "12px",
          padding: "28px 24px",
          width: "100%",
          maxWidth: "340px",
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          boxShadow: bloqueada
            ? "0 20px 60px rgba(0,0,0,0.6)"
            : "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(249,190,12,0.1)",
          position: "relative",
        }}
      >
        <button
          onClick={onCerrar}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(194, 37, 37, 0.36)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            color: "rgba(255, 255, 255, 0.92)",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >✕</button>

        <span style={{
          fontSize: "14px",
          color: bloqueada ? "rgba(255, 255, 255, 0.62)" : "rgba(249, 190, 12, 0.93)",
          fontFamily: FONTS.mono,
          letterSpacing: "3px",
        }}>
          TARJETA #{String(tarjeta?.numeracion || 0).padStart(3, "0")}
        </span>

        <div style={{
          width: "100%",
          maxWidth: "300px",
          aspectRatio: "0.7",
          borderRadius: "20px",
          overflow: "hidden",
          border: `0px solid ${bloqueada ? "rgba(255, 4, 4, 0.08)" : "rgba(249, 12, 12, 0.4)"}`,
          background: "#2f040493",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {!bloqueada && !imgError && rutaFoto ? (
            <img
              src={rutaFoto}
              alt={tarjeta?.nombreCancion}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ fontSize: "70px", opacity: 0.7 }}>
              {bloqueada ? "🔒" : esMia ? "⭐" : "🎵"}
            </div>
          )}
        </div>

        {bloqueada ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", fontFamily: FONTS.cuerpo, color: "rgba(255, 255, 255, 0.77)" }}>
              Sin reclamar
            </p>
            <p style={{ margin: 0, fontSize: "12px",fontsfamily: FONTS.cuerpo,color: "rgba(255, 255, 255, 0.38)", fontFamily: "monospace" }}>
              Esta tarjeta aún está por reclamar
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{ margin: "0 0 4px", fontSize: "24px",fontStyle:"FONTS.titulo",color: "rgba(206, 187, 13, 0.51)", letterSpacing: "3px", textTransform: "uppercase", fontWeight: "900" }}>
              {tarjeta?.album}
            </p>

            <h3 style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "600", fontFamily: FONTS.cuerpo, color: "#FFFFFF", lineHeight: 1.2 }}>
              {tarjeta?.nombreCancion}
            </h3>

            <div style={{ height: "1px", background: "rgba(249,190,12,0.2)", margin: "0 0 16px" }} />

            <div style={{ background: "rgba(249,190,12,0.06)", border: "1px solid rgba(249,190,12,0.15)", borderRadius: "10px", padding: "12px 16px", textAlign: "left" }}>
              <p style={{ margin: "0 0 4px", fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase" }}>
                {esMia ? "Reclamada por ti" : "Reclamada por"}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: esMia ? "#a71a1a" : "#FFFFFF", textTransform: "capitalize" }}>
                {nombreUsuario || "Coleccionista"}
              </p>
              {fechaFormateada && (
                <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                  {fechaFormateada}
                </p>
              )}

              {tarjeta?.dedicatoria && (
                <div style={{ marginTop: "10px", background: "rgba(249,190,12,0.06)", border: "1px solid rgba(249,190,12,0.15)", borderRadius: "8px", padding: "10px 14px", textAlign: "left" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>
                    Dedicatoria
                  </p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#FFFFFF", fontStyle: "italic", lineHeight: 1.5 }}>
                    "{tarjeta.dedicatoria}"
                  </p>
                </div>
              )}

              {spotifyUrl && (
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#1DB954", borderRadius: "20px", padding: "10px 20px", color: "#000", fontWeight: "700", fontSize: "13px", textDecoration: "none", marginTop: "12px" }}
                >
                  🎵 Escuchar en Spotify
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}