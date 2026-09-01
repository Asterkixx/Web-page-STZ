import { useState } from "react";
import { FONTS } from "./theme";
import ModalTarjeta from "./ModalTarjeta";

export default function Tarjeta({ tarjeta, userId, animando }) {
  const esMia       = tarjeta.usuarioId === userId;
  const bloqueada   = !tarjeta.desbloqueada;
  const [hover,       setHover]       = useState(false);
  const [imgError,    setImgError]    = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const numeroLimpio = parseInt(tarjeta.numeracion, 10);
  const rutaFoto     = `/tarjetas/${numeroLimpio}.jpg`;

  return (
    <>
      {modalAbierto && (
        <ModalTarjeta
          tarjeta={tarjeta}
          onCerrar={() => setModalAbierto(false)}
          userId={userId}
        />
      )}

      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>

        <span style={{ fontSize: "14px", color: "rgb(255,255,255)", fontFamily: FONTS.mono, letterSpacing: "2px", fontWeight: "300" }}>
          {String(tarjeta.numeracion).padStart(3, "0")}
        </span>

        <div
          onClick={() => setModalAbierto(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width:        "90px",
            height:       "130px",
            borderRadius: "15px",
            cursor:       "pointer",
            transition:   "transform 0.25s ease, box-shadow 0.25s ease",
            transform:    animando ? "scale(1.1)" : hover ? "translateY(-4px) scale(1.03)" : "scale(1)",
            border:       esMia
              ? `2px solid rgb(156, 17, 17)`
              : bloqueada
              ? `0px solid rgba(205, 19, 19, 0.5)`
              : `0px solid rgb(255, 255, 255)`,
            boxShadow:    animando
              ? `0 0 28px rgba(0, 0, 0, 0)`
              : esMia
              ? `0 4px 8px rgba(145, 15, 15, 0.68)`
              : hover
              ? `0 10px 28px rgba(0,0,0,0.6)`
              : `0 2px 8px rgba(0,0,0,0.5)`,
            userSelect:   "none",
            position:     "relative",
            overflow:     "hidden",
            background:   "#c0001386",
          }}
        >
          {!bloqueada && !imgError ? (
            <img src={rutaFoto} alt={tarjeta.nombreCancion} onError={() => setImgError(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : bloqueada ? (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #000000 0%, #000000 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px", opacity: 0.7 }}>🔒</div>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #000000 0%, #000000 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px" }}>
              {esMia ? "⭐" : "🎵"}
            </div>
          )}

          {esMia && (
            <span style={{ position: "absolute", top: "6px", right: "6px", background: "#F9BE0C", color: "#000", fontSize: "6px", fontWeight: "800", padding: "2px 5px", borderRadius: "3px", zIndex: 3 }}>
              TUYA
            </span>
          )}

          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: esMia ? `linear-gradient(90deg, transparent, #F9BE0C, transparent)` : `linear-gradient(90deg, transparent, rgb(0,0,0), transparent)`, zIndex: 3 }} />
        </div>

        <p style={{ margin: 0, fontSize: "15px", fontStyle: "italic", letterSpacing: "2px", color: bloqueada ? "rgba(255,255,255,0.35)" : "#FFFFFF", fontWeight: bloqueada ? "400" : "700", textAlign: "center", maxWidth: "120px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {bloqueada ? "???" : tarjeta.nombreCancion}
        </p>
      </div>
    </>
  );
}
