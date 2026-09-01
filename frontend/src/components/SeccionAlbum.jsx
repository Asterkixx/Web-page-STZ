import { useRef } from "react";
import { C, FONTS } from "./theme";
import Tarjeta from "./Tarjeta";

export default function SeccionAlbum({ nombre, tarjetas, tarjetasFiltradas, userId, animando }) {
  const scrollRef = useRef(null);
  if (tarjetasFiltradas.length === 0) return null;

  const desbloqueadas   = tarjetas.filter((t) => t.desbloqueada).length;
  const total           = tarjetas.length;
  const porcentajeAlbum = Math.round((desbloqueadas / total) * 100);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div style={{ marginBottom: "48px" }}>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "16px", color: "#c00013a1", fontWeight: "900", letterSpacing: "5px", fontFamily: FONTS.titulo, textTransform: "uppercase" }}>
            álbum
          </p>
          <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "900", color: C.blanco, letterSpacing: "2px", fontStyle: "italic", lineHeight: 1 }}>
            {nombre}
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 4px", fontSize: "14px", fontFamily: FONTS.cuerpo, color: desbloqueadas === total ? "#ffffff" : C.amarillo }}>
            {desbloqueadas}/{total} desbloqueadas
          </p>
          <div style={{ width: "120px", height: "8px", background: "rgb(95, 9, 9)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${porcentajeAlbum}%`, background: `rgba(249, 225, 12, 0.97)`, borderRadius: "2px", transition: "width 0.6s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ position: "relative", padding: "0 24px" }}>
        <button onClick={() => scroll(-1)} style={{ position: "absolute", left: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `rgba(4,33,47,0.9)`, border: `0px solid ${C.azulMedio}`, borderRadius: "50%", width: "32px", height: "32px", color: C.blanco, cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>

        <div ref={scrollRef} style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px", paddingTop: "4px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {tarjetasFiltradas.map((tarjeta) => (
            <Tarjeta key={tarjeta.codigoQR} tarjeta={tarjeta} userId={userId} animando={animando === tarjeta.codigoQR} />
          ))}
        </div>

        <button onClick={() => scroll(1)} style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `rgba(4,33,47,0.9)`, border: `0px solid ${C.azulMedio}`, borderRadius: "50%", width: "32px", height: "32px", color: C.blanco, cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      <div style={{ height: "1px", background: "rgba(165, 0, 0, 0.18)", marginTop: "16px" }} />
    </div>
  );
}
