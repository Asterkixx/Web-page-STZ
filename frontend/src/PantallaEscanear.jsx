import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

export default function PantallaEscanear() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codigoQR = searchParams.get("codigo");

  const [nombre, setNombre] = useState(() => localStorage.getItem("albumNombre") || "");
  const [paso, setPaso] = useState("nombre"); // "nombre" | "raspar" | "exito" | "error"
  const [tarjeta, setTarjeta] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [raspado, setRaspado] = useState(0); // 0 a 100
  const [revelada, setRevelada] = useState(false);
  const canvasRef = useRef(null);
  const raspandoRef = useRef(false);

  // Si ya tiene nombre guardado, salta al paso de raspar
  useEffect(() => {
    if (nombre) {
      setPaso("raspar");
    }
  }, []);

  // Inicializar canvas de raspado cuando llegamos a ese paso
  useEffect(() => {
    if (paso === "raspar" && canvasRef.current) {
      inicializarCanvas();
    }
  }, [paso]);

  const inicializarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fondo gris que se raspa
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto encima del gris
    ctx.fillStyle = "#C9A84C";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("¡RASPA AQUÍ!", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "14px monospace";
    ctx.fillStyle = "rgba(201,168,76,0.6)";
    ctx.fillText("🔒", canvas.width / 2, canvas.height / 2 + 20);
  };

  const raspar = (e) => {
    if (!canvasRef.current || revelada) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    // Soporta touch y mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Calcular porcentaje raspado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentes = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentes++;
    }
    const porcentaje = Math.round((transparentes / (pixels.length / 4)) * 100);
    setRaspado(porcentaje);

    // Si raspó más del 60%, revelar automáticamente
    if (porcentaje > 60 && !revelada) {
      setRevelada(true);
      reclamarTarjeta();
    }
  };

  const handleEntrarNombre = () => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio || nombreLimpio.length < 2) return;
    localStorage.setItem("albumNombre", nombreLimpio);
    setPaso("raspar");
  };

  const reclamarTarjeta = async () => {
    const nombreGuardado = localStorage.getItem("albumNombre");
    const usuarioId = `user_${nombreGuardado?.toLowerCase().replace(/\s+/g, "_")}`;

    try {
     const res = await fetch(`${API_URL}/api/tarjetas/reclamar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoQR, usuarioId }),
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
    } catch (err) {
      setMensaje("No se pudo conectar con el servidor");
      setPaso("error");
    }
  };

  // ── PASO: Pedir nombre ────────────────────────────────────────────────────
  if (paso === "nombre") {
    return (
      <div style={estilos.fondo}>
        <div style={estilos.tarjeta}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎵</div>
          <h1 style={estilos.titulo}>Álbum Virtual</h1>
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
      </div>
    );
  }

  // ── PASO: Raspar ─────────────────────────────────────────────────────────
  if (paso === "raspar") {
    return (
      <div style={estilos.fondo}>
        <div style={estilos.tarjeta}>
          <p style={{ color: "#888", fontSize: "12px", marginBottom: "8px", fontFamily: "monospace" }}>
            #{codigoQR}
          </p>
          <h2 style={{ ...estilos.titulo, fontSize: "1.4rem", marginBottom: "4px" }}>
            Tarjeta misteriosa
          </h2>
          <p style={estilos.subtitulo}>Raspa para revelar tu canción</p>

          {/* Contenedor del raspado */}
          <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "linear-gradient(135deg, #1a1200, #2a1f00)", border: "1px solid #C9A84C" }}>
            {/* Contenido debajo (se revela al raspar) */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{ fontSize: "2rem" }}>🎵</div>
              <p style={{ color: "#C9A84C", fontWeight: "700", fontSize: "16px", textAlign: "center", padding: "0 16px" }}>
                {revelada ? "¡Reclamando..." : "???"}
              </p>
            </div>

            {/* Canvas encima para raspar */}
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair", touchAction: "none" }}
              onMouseDown={() => { raspandoRef.current = true; }}
              onMouseUp={() => { raspandoRef.current = false; }}
              onMouseMove={(e) => raspandoRef.current && raspar(e)}
              onTouchMove={raspar}
            />
          </div>

          {/* Barra de progreso del raspado */}
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "8px" }}>
            <div style={{ height: "100%", width: `${raspado}%`, background: "linear-gradient(90deg, #8B6914, #C9A84C)", borderRadius: "2px", transition: "width 0.1s" }} />
          </div>
          <p style={{ color: "#888", fontSize: "11px", fontFamily: "monospace" }}>{raspado}% raspado</p>
        </div>
      </div>
    );
  }

  // ── PASO: Éxito ───────────────────────────────────────────────────────────
  if (paso === "exito" && tarjeta) {
    return (
      <div style={estilos.fondo}>
        <div style={{ ...estilos.tarjeta, borderColor: "#C9A84C", boxShadow: "0 0 30px rgba(201,168,76,0.3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🎉</div>
          <p style={{ color: "#888", fontSize: "11px", fontFamily: "monospace", marginBottom: "4px" }}>
            #{String(tarjeta.numeracion).padStart(3, "0")} · {tarjeta.album}
          </p>
          <h2 style={{ ...estilos.titulo, color: "#C9A84C", fontSize: "1.6rem" }}>
            {tarjeta.nombreCancion}
          </h2>
          {mensaje && <p style={{ color: "#888", fontSize: "13px" }}>{mensaje}</p>}
          <p style={{ color: "rgba(240,237,232,0.5)", fontSize: "13px", margin: "8px 0 20px" }}>
            Añadida a tu álbum ✨
          </p>
          <button style={estilos.boton} onClick={() => navigate("/")}>
            Ver mi álbum →
          </button>
        </div>
      </div>
    );
  }

  // ── PASO: Error ───────────────────────────────────────────────────────────
  if (paso === "error") {
    return (
      <div style={estilos.fondo}>
        <div style={estilos.tarjeta}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>⚠️</div>
          <h2 style={{ ...estilos.titulo, color: "#E87E7E" }}>Código no válido</h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "8px 0 20px" }}>{mensaje}</p>
          <button style={estilos.boton} onClick={() => navigate("/")}>
            Volver al álbum →
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const estilos = {
  fondo: {
    minHeight: "100vh",
    background: "#0A0A0F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  tarjeta: {
    background: "#12121C",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  titulo: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#F0EDE8",
  },
  subtitulo: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(240,237,232,0.4)",
  },
  input: {
    width: "100%",
    background: "#1e1e2e",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#F0EDE8",
    fontSize: "16px",
    padding: "12px",
    outline: "none",
    marginTop: "8px",
  },
  boton: {
    width: "100%",
    background: "#C9A84C",
    border: "none",
    borderRadius: "8px",
    color: "#0A0A0F",
    fontSize: "15px",
    fontWeight: "700",
    padding: "12px",
    cursor: "pointer",
    marginTop: "8px",
  },
};
