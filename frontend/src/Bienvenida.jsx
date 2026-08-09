// =============================================
// Bienvenida.jsx — SKZ VIRTUAL ALBUM
// Landing page inspirada en diseño limpio tipo eToro
// =============================================

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Bienvenida() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Animación de entrada
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight:     "100vh",
      background:    "#060a0c",
      display:       "flex",
      flexDirection: "column",
      fontFamily:    "'Segoe UI', system-ui, sans-serif",
      overflow:      "hidden",
      position:      "relative",
    }}>

      {/* ── Fondo con partículas / gradiente radial ── */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 30%, rgb(0, 0, 0) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 80% 80%, rgba(0, 0, 0, 0.12) 0%, transparent 60%)
        `,
        pointerEvents: "none",
      }} />

     

      {/* ── Contenido principal centrado ── */}
      <div style={{
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "40px 24px",
        position:       "relative",
        zIndex:         1,
        opacity:        visible ? 1 : 0,
        transform:      visible ? "translateY(0)" : "translateY(24px)",
        transition:     "opacity 0.8s ease, transform 0.8s ease",
      }}>

        {/* ── Logo circular ── */}
        <div style={{
          width:        "400px",
          height:       "400px",
          borderRadius: "50%",
          background:   "rgba(0, 0, 0, 0)",
          display:      "flex",
          alignItems:   "center",
          justifyContent:"center",
          marginBottom: "48px",
          boxShadow:    "0 0 0 1px rgba(0, 0, 0, 0), 0 0 40px rgba(0, 0, 0, 0), 0 20px 60px rgba(0,0,0,0.4)",
          transition:   "transform 0.3s ease, box-shadow 0.3s ease",
          cursor:       "default",
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0), 0 0 60px rgba(0, 0, 0, 0), 0 24px 80px rgba(0, 0, 0, 0)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 0 1px rgba(0, 0, 0, 0), 0 0 40px rgba(0, 0, 0, 0), 0 20px 60px rgba(0, 0, 0, 0)";
          }}
        >
          <img
            src="/skz-icon.png"
            alt="Stray Kids"
            style={{ width: "120%", height: "120%", objectFit: "contain" }}
          />
        </div>


{/* ── Video de fondo ── */}
<video
  muted
  autoPlay
  loop
  playsInline
  style={{
    position:   "absolute",
    inset:      0,
    width:      "100%",
    height:     "100%",
    objectFit:  "cover",
    opacity:    0.09,
    zIndex:     0,
    pointerEvents: "none",
  }}
>
  <source src="/videos/skz.mp4" type="video/mp4" />
</video>


        {/* ── Título principal ── */}
        <h1 style={{
          margin:        "0 0 16px",
          fontSize:      "clamp(36px, 7vw, 72px)",
          fontWeight:    "900",
          fontFamily:     "bebas neue",
          fontStyle:     "normal",
          color:         "#FFFFFF",
          letterSpacing: "-1.5px",
          textAlign:     "center",
          lineHeight:    0.9,
        }}>
          SKZ Virtual 
        
          <span style={{ color: "#ff00009a",}}>   Album  </span>

        </h1>

        {/* ── Descripción breve ── */}
        <p style={{
          margin:      "0 0 48px",
          fontSize:    "clamp(14px, 2vw, 18px)",
          fontStyle:  "italic",
          fontfamily: "oswald,sans-serif",
          color:       "rgba(255, 255, 255, 0.49)",
          textAlign:   "center",
          maxWidth:    "480px",
          lineHeight:  1.7,
          letterSpacing: "0.2px",
        }}>
          Colección virtual de los álbumes de Stray Kids.<br />
        Escanea tú código QR para acceder a la canción que te tocó y disfrutar de la experiencia completa.
        </p>

        {/* ── Botón principal ── */}
        <button
          onClick={() => navigate("/album")}
          style={{
            background:    "#f9280cce",
            border:        "none",
            borderRadius:  "10px",
            color:         "#000000",
            fontSize:      "16px",
            fontWeight:    "800",
            padding:       "16px 48px",
            cursor:        "pointer",
            letterSpacing: "0.5px",
            transition:    "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
            boxShadow:     "0 4px 24px rgba(95, 5, 5, 0.72)",
            fontFamily:    "'Segoe UI', system-ui, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform   = "translateY(-2px) scale(1.03)";
            e.currentTarget.style.boxShadow   = "0 8px 32px rgba(249, 20, 12, 0.42)";
            e.currentTarget.style.background  = "#f9280cce";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform   = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow   = "0 4px 24px rgba(249,20,12,0.42)";
            e.currentTarget.style.background  = "#f9280cce";
          }}
        >
          Ir al álbum →
        </button>

        {/* ── Stats decorativas ── */}
        <div style={{
          display:       "flex",
          gap:           "48px",
          marginTop:     "64px",
          flexWrap:      "wrap",
          justifyContent:"center",
        }}>
          {[
        
          ].map((stat) => (
            <div key={stat.texto} style={{ textAlign: "center" }}>
              <div style={{
                fontSize:   "28px",
                fontWeight: "900",
                color:      "#ff0a0a",
                lineHeight: 1,
              }}>
                {stat.numero}
              </div>
              <div style={{
                fontSize:      "11px",
                color:         "rgba(255,255,255,0.35)",
                marginTop:     "4px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}>
                {stat.texto}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer mínimo ── */}
      <div style={{
        padding:       "1px",
        textAlign:     "center",
        borderTop:     "1px solid rgba(224, 212, 212, 0.14)",
        position:      "relative",
        zIndex:        1,
      }}>
       
      </div>
    </div>
  );
}
