import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { C, FONTS, API_URL } from "./components/theme";
import fondo from "./Straykidsft.jpg";

const Fondo = ({ children }) => (
  <div style={{
    minHeight: "100vh",
    backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.99)), url(${fondo})`,
    backdropFilter: "blur(20px)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    color: C.blanco,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  }}>
    <header style={{ background: "rgba(0, 0, 0, 0)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{
        maxWidth: "400px",
        height: "80px",
        margin: "0 auto",
        padding: "12px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}>
        <img
          src="/skz-logo.png"
          alt="SKZ Virtual Album"
          style={{ height: "56px", width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>
    </header>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 80px)",
      padding: "24px 16px",
    }}>
      {children}
    </div>
  </div>
);

export default function PantallaEscanear() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const codigoQR       = searchParams.get("codigo");

  const [nombre,    setNombre]    = useState(() => localStorage.getItem("albumNombre") || "");
  const [paso,      setPaso]      = useState("nombre");
  const [tarjeta,   setTarjeta]   = useState(null);
  const [mensaje,   setMensaje]   = useState("");
  const [raspado,   setRaspado]   = useState(0);
  const [revelada,  setRevelada]  = useState(false);

  // ── Dedicatoria ──
  const [dedicatoria,         setDedicatoria]         = useState("");
  const [mostrarDedicatoria,  setMostrarDedicatoria]  = useState(false);
  const [reclamando,          setReclamando]          = useState(false);

  const canvasRef   = useRef(null);
  const raspandoRef = useRef(false);

  useEffect(() => {
    if (nombre) setPaso("raspar");
  }, []);

  useEffect(() => {
    if (paso === "raspar" && canvasRef.current) inicializarCanvas();
  }, [paso]);

  const inicializarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#F9BE0C";
    ctx.font      = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚡ RASPA AQUÍ ⚡", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font      = "13px monospace";
    ctx.fillStyle = "rgba(249,190,12,0.5)";
    ctx.fillText("Desliza para revelar", canvas.width / 2, canvas.height / 2 + 16);
  };

  const raspar = (e) => {
    if (!canvasRef.current || revelada) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const rect   = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    const imageData   = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels      = imageData.data;
    let transparentes = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentes++;
    }
    const pct = Math.round((transparentes / (pixels.length / 4)) * 100);
    setRaspado(pct);

    // Al llegar al 60% mostramos la canción y el input de dedicatoria
    if (pct > 60 && !revelada) {
      setRevelada(true);
      fetch(`${API_URL}/api/tarjetas/${codigoQR}`)
        .then(r => r.json())
        .then(data => { if (data.ok) setTarjeta(data.tarjeta); })
        .catch(() => {});
      setMostrarDedicatoria(true);
    }
  };

  const handleEntrarNombre = () => {
    const limpio = nombre.trim();
    if (!limpio || limpio.length < 2) return;
    localStorage.setItem("albumNombre", limpio);
    const userId = `user_${limpio.toLowerCase().replace(/\s+/g, "_")}`;
    localStorage.setItem("albumUserId", userId);
    setPaso("raspar");
  };

  const reclamarTarjeta = async () => {
    if (reclamando) return;
    setReclamando(true);
    const nombreGuardado = localStorage.getItem("albumNombre");
    const usuarioId      = `user_${nombreGuardado?.toLowerCase().replace(/\s+/g, "_")}`;

    try {
      const res  = await fetch(`${API_URL}/api/tarjetas/reclamar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ codigoQR, usuarioId, dedicatoria: dedicatoria.trim() || null }),
      });
      const data = await res.json();

      if (data.ok) {
        setTarjeta(data.tarjeta);
        setPaso("exito");
      } else if (data.yaReclamada) {
        setTarjeta(data.tarjeta);
        setMensaje(data.esTuya ? "¡Ya es tuya!" : "Ya fue reclamada por otro usuario");
        setPaso("exito");
      } else {
        setMensaje(data.mensaje || "Código no válido");
        setPaso("error");
      }
    } catch {
      setMensaje("No se pudo conectar con el servidor");
      setPaso("error");
    } finally {
      setReclamando(false);
    }
  };

  // ── PASO: Nombre ──────────────────────────────────────────────────────────
  if (paso === "nombre") {
    return (
      <Fondo>
        <div style={estilos.card}>
          <div style={{ fontSize: "3rem" }}>🎵</div>
          <h1 style={estilos.titulo}>SKZ Virtual Album</h1>
          <p style={estilos.subtitulo}>¿Cómo te llamas?</p>
          <input
            style={estilos.input}
            type="text"
            placeholder="Tu nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEntrarNombre()}
            autoFocus
            maxLength={30}
          />
          <button style={estilos.boton} onClick={handleEntrarNombre}>
            Continuar →
          </button>
        </div>
      </Fondo>
    );
  }

  // ── PASO: Raspar ──────────────────────────────────────────────────────────
  if (paso === "raspar") {
    return (
      <Fondo>
        <div style={estilos.card}>
          <p style={{ color: C.blancoTenue, fontSize: "11px", fontFamily: FONTS.mono }}>
            {codigoQR}
          </p>
          <h2 style={{ ...estilos.titulo, fontSize: "1.4rem" }}>
            Tarjeta misteriosa
          </h2>
          <p style={estilos.subtitulo}>
            {revelada ? "¡Canción revelada!" : "Raspa para descubrir tu canción"}
          </p>

          {/* Canvas de raspado */}
          <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", background: "linear-gradient(135deg, #04212F, #0a0a1f)", border: "1px solid rgba(249,190,12,0.3)" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{ fontSize: "2rem" }}>🎵</div>
              <p style={{ color: C.amarillo, fontWeight: "700", fontSize: "14px", textAlign: "center", padding: "0 16px" }}>
                {revelada ? "¡Completado!" : "???"}
              </p>
            </div>
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair", touchAction: "none" }}
              onMouseDown={() => { raspandoRef.current = true; }}
              onMouseUp={() => { raspandoRef.current = false; }}
              onMouseMove={(e) => raspandoRef.current && raspar(e)}
              onTouchMove={raspar}
              onTouchStart={() => { raspandoRef.current = true; }}
              onTouchEnd={() => { raspandoRef.current = false; }}
            />
          </div>

          {/* Barra de progreso */}
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${raspado}%`, background: "linear-gradient(90deg, #3236A2, #F9BE0C)", borderRadius: "2px", transition: "width 0.1s" }} />
          </div>
          <p style={{ color: C.blancoTenue, fontSize: "10px", fontFamily: FONTS.mono }}>
            {raspado}% raspado
          </p>

          {/* Foto + nombre de la canción — aparece al raspar suficiente */}
          {revelada && tarjeta && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "8px 0" }}>
              <img
                src={`/tarjetas/${tarjeta.numeracion}.jpg`}
                alt={tarjeta.nombreCancion}
                style={{ width: "120px", height: "150px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(249,190,12,0.3)" }}
              />
              <p style={{ margin: 0, fontSize: "10px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase", fontFamily: FONTS.mono }}>
                #{String(tarjeta.numeracion).padStart(3, "0")} · {tarjeta.album}
              </p>
              <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", color: C.amarillo, fontFamily: FONTS.titulo, letterSpacing: "1px", textTransform: "uppercase" }}>
                {tarjeta.nombreCancion}
              </h2>
            </div>
          )}

          {/* Input dedicatoria — aparece al raspar suficiente */}
          {mostrarDedicatoria && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              <div style={{ height: "1px", background: "rgba(249,190,12,0.2)" }} />
              <p style={{ margin: 0, fontSize: "13px", color: C.blancoSuave, textAlign: "center" }}>
                ¿Quieres dejar una dedicatoria? <span style={{ color: C.blancoTenue }}>(opcional)</span>
              </p>
              <input
                type="text"
                placeholder='Ej: "Para mi mejor amiga 💛"'
                maxLength={150}
                value={dedicatoria}
                onChange={(e) => setDedicatoria(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && reclamarTarjeta()}
                autoFocus
                style={estilos.input}
              />
              <p style={{ margin: 0, fontSize: "10px", color: C.blancoTenue, textAlign: "right", fontFamily: FONTS.mono }}>
                {dedicatoria.length}/150
              </p>
              <button
                onClick={reclamarTarjeta}
                disabled={reclamando}
                style={{
                  ...estilos.boton,
                  background: reclamando ? "rgba(50,54,162,0.5)" : "linear-gradient(135deg, #3236A2, #4a4fcf)",
                  color: "#FFFFFF",
                  cursor: reclamando ? "not-allowed" : "pointer",
                }}
              >
                {reclamando ? "Reclamando..." : "¡Reclamar tarjeta! ⚡"}
              </button>
            </div>
          )}
        </div>
      </Fondo>
    );
  }

  // ── PASO: Éxito ───────────────────────────────────────────────────────────
  if (paso === "exito" && tarjeta) {
    return (
      <Fondo>
        <div style={{ ...estilos.card, border: "1px solid rgba(249,190,12,0.4)", boxShadow: "0 0 40px rgba(249,190,12,0.15)" }}>
          <div style={{ fontSize: "3rem" }}>🎉</div>
          <p style={{ color: C.blancoTenue, fontSize: "11px", fontFamily: FONTS.mono }}>
            #{String(tarjeta.numeracion).padStart(3, "0")} · {tarjeta.album}
          </p>
          <h2 style={{ ...estilos.titulo, color: C.amarillo, fontSize: "1.6rem" }}>
            {tarjeta.nombreCancion}
          </h2>
          {mensaje && (
            <p style={{ color: C.blancoSuave, fontSize: "13px" }}>{mensaje}</p>
          )}
          {tarjeta.dedicatoria && (
            <div style={{ width: "100%", background: "rgba(249,190,12,0.06)", border: "1px solid rgba(249,190,12,0.15)", borderRadius: "10px", padding: "12px 16px", textAlign: "left" }}>
              <p style={{ margin: "0 0 4px", fontSize: "9px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase" }}>
                Tu dedicatoria
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#FFFFFF", fontStyle: "italic", lineHeight: 1.5 }}>
                "{tarjeta.dedicatoria}"
              </p>
            </div>
          )}
          <p style={{ color: C.blancoTenue, fontSize: "12px" }}>
            Añadida a tu álbum ✨
          </p>
          <button style={estilos.boton} onClick={() => navigate("/album")}>
            Ver mi álbum →
          </button>
        </div>
      </Fondo>
    );
  }

  // ── PASO: Error ───────────────────────────────────────────────────────────
  if (paso === "error") {
    return (
      <Fondo>
        <div style={estilos.card}>
          <div style={{ fontSize: "3rem" }}>⚠️</div>
          <h2 style={{ ...estilos.titulo, color: "#e74c3c" }}>Código no válido</h2>
          <p style={{ color: C.blancoSuave, fontSize: "13px" }}>{mensaje}</p>
          <button style={{ ...estilos.boton, background: "rgba(231,76,60,0.2)", color: "#FFFFFF" }} onClick={() => navigate("/album")}>
            Volver al álbum
          </button>
        </div>
      </Fondo>
    );
  }

  return null;
}

const estilos = {
  card: {
    background:    "rgba(255,255,255,0.04)",
    border:        "1px solid rgba(255,255,255,0.08)",
    borderRadius:  "20px",
    padding:       "32px 24px",
    width:         "100%",
    maxWidth:      "400px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "12px",
    backdropFilter:"blur(16px)",
    boxShadow:     "0 20px 60px rgba(0,0,0,0.5)",
    textAlign:     "center",
  },
  titulo: {
    margin:      0,
    fontSize:    "1.8rem",
    fontWeight:  "800",
    color:       C.amarillo,
    fontFamily:  FONTS.titulo,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  subtitulo: {
    margin:    0,
    fontSize:  "13px",
    color:     C.blancoTenue,
  },
  input: {
    width:        "100%",
    background:   "rgba(255,255,255,0.06)",
    border:       "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    color:        "#FFFFFF",
    fontSize:     "15px",
    padding:      "12px 14px",
    outline:      "none",
    boxSizing:    "border-box",
    fontFamily:   "'Segoe UI', system-ui, sans-serif",
    textAlign:    "left",
  },
  boton: {
    width:        "100%",
    background:   C.amarillo,
    border:       "none",
    borderRadius: "10px",
    color:        "#000000",
    fontSize:     "15px",
    fontWeight:   "700",
    padding:      "13px",
    cursor:       "pointer",
    fontFamily:   "'Segoe UI', system-ui, sans-serif",
    transition:   "opacity 0.2s",
  },
};