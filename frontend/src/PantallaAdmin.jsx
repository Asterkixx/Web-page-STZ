// =============================================
// PantallaAdmin.jsx — SKZ VIRTUAL ALBUM
// Panel de administrador
// Secciones: Estadísticas, Dedicatorias, QR
// =============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const API_URL      = "https://web-page-stz.onrender.com";
const VERCEL_URL   = "https://web-page-stz-hl5m.vercel.app";
const CONTRASENA   = "Proyectito1215";

const C = {
  fondo:       "#04212F",
  gris:        "#0a0a12",
  azul:        "#3236A2",
  blanco:      "#640606d8",
  blanco:      "#FFFFFF",
  blancoTenue: "rgba(255,255,255,0.35)",
  rojo:        "#e74c3c",
  verde:       "#2ecc71",
};

// =============================================
// SECCIÓN: Estadísticas
// =============================================
function Estadisticas({ tarjetas }) {
  const total          = tarjetas.length;
  const desbloqueadas  = tarjetas.filter(t => t.desbloqueada).length;
  const bloqueadas     = total - desbloqueadas;
  const porcentaje     = Math.round((desbloqueadas / total) * 100);

  // Agrupar por álbum
  const porAlbum = tarjetas.reduce((acc, t) => {
    const a = t.album || "Otras";
    if (!acc[a]) acc[a] = { total: 0, desbloqueadas: 0 };
    acc[a].total++;
    if (t.desbloqueada) acc[a].desbloqueadas++;
    return acc;
  }, {});

  return (
    <div>
      {/* Stats generales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Total tarjetas", valor: total,         color: C.blanco },
          { label: "Desbloqueadas",  valor: desbloqueadas, color: C.verde },
          { label: "Bloqueadas",     valor: bloqueadas,    color: C.rojo },
          { label: "Progreso",       valor: `${porcentaje}%`, color: C.amarillo },
        ].map((s) => (
          <div key={s.label} style={{ background: "rgba(32, 25, 25, 0.56)", border: "0px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "900", color: s.color, lineHeight: 1 }}>{s.valor}</div>
            <div style={{ fontSize: "10px", color: C.blancoTenue, marginTop: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Barra de progreso global */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: C.blancoTenue, letterSpacing: "1px", textTransform: "uppercase" }}>Progreso global</span>
          <span style={{ fontSize: "11px", color: C.amarillo, fontFamily: "monospace" }}>{desbloqueadas}/{total}</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px" }}>
          <div style={{ height: "100%", width: `${porcentaje}%`, background: `rgb(231, 8, 8)`, borderRadius: "4px", transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Progreso por álbum */}
      <h3 style={{ margin: "0 0 16px", fontSize: "13px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase" }}>
        Por álbum
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(porAlbum).map(([album, data]) => {
          const pct = Math.round((data.desbloqueadas / data.total) * 100);
          return (
            <div key={album}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: C.blanco, fontWeight: "600" }}>{album}</span>
                <span style={{ fontSize: "11px", color: pct === 100 ? C.verde : C.amarillo, fontFamily: "monospace" }}>
                  {data.desbloqueadas}/{data.total}
                </span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.verde : `rgb(231, 8, 8)`, borderRadius: "2px", transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================
// SECCIÓN: Dedicatorias
// =============================================
function Dedicatorias({ tarjetas }) {
  const conDedicatoria = tarjetas.filter(t => t.dedicatoria);

  if (conDedicatoria.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: C.blancoTenue }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>💌</div>
        <p>Aún no hay dedicatorias</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ margin: "0 0 16px", fontSize: "11px", color: C.blancoTenue, letterSpacing: "1px" }}>
        {conDedicatoria.length} dedicatoria{conDedicatoria.length !== 1 ? "s" : ""} registrada{conDedicatoria.length !== 1 ? "s" : ""}
      </p>
      {conDedicatoria.map(t => {
        const nombre = t.usuarioId?.replace("user_", "").replace(/_/g, " ");
        const fecha  = t.fechaReclamo ? new Date(t.fechaReclamo).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
        return (
          <div key={t.codigoQR} style={{ background: "rgba(249, 12, 12, 0.13)", border: "0px solid rgba(249,190,12,0.15)", borderRadius: "12px", padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <span style={{ fontSize: "10px", color: C.amarillo, fontFamily: "monospace", letterSpacing: "1px" }}>
                  #{String(t.numeracion).padStart(3, "0")}
                </span>
                <span style={{ fontSize: "10px", color: C.blancoTenue, margin: "0 6px" }}>·</span>
                <span style={{ fontSize: "10px", color: C.blancoTenue }}>{t.nombreCancion}</span>
              </div>
              <span style={{ fontSize: "10px", color: C.blancoTenue, fontFamily: "monospace", whiteSpace: "nowrap" }}>{fecha}</span>
            </div>
            <p style={{ margin: "0 0 6px", fontSize: "15px", color: C.blanco, fontStyle: "italic", lineHeight: 1.5 }}>
              "{t.dedicatoria}"
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: C.blancoTenue, textTransform: "capitalize" }}>
              — {nombre}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// =============================================
// SECCIÓN: Generar QR
// =============================================
function GenerarQR({ tarjetas }) {
  const [generando, setGenerando] = useState(false);
  const [qrVisible, setQrVisible] = useState([]);
  const [busqueda,  setBusqueda]  = useState("");

  const tarjetasFiltradas = tarjetas.filter(t =>
    busqueda === "" ||
    t.nombreCancion.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(t.numeracion).includes(busqueda)
  );

 const generarQRIndividual = (codigoQR) => {
  const url = `${VERCEL_URL}/validar/${codigoQR}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&t=${codigoQR}`;
};

  const mostrarQRs = () => {
    setGenerando(true);
    setQrVisible(tarjetasFiltradas.slice(0, 20));
    setTimeout(() => setGenerando(false), 500);
  };

  const descargarQR = (codigoQR, nombreCancion) => {
    const url  = generarQRIndividual(codigoQR);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `QR_${codigoQR}_${nombreCancion}.png`;
    link.target   = "_blank";
    link.click();
  };

  return (
    <div>
      <p style={{ margin: "0 0 16px", fontSize: "12px", color: C.blancoTenue, lineHeight: 1.6 }}>
        Aquí generarás los códigos Qr para cada canción: <code style={{ color: C.amarillo, fontSize: "11px" }}></code>
      </p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por canción o número..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: "100%", background: "rgba(83, 17, 17, 0.57)",border: "0px solid rgba(83, 17, 17, 0.3)",borderRadius: "8px", color: C.blanco, fontSize: "14px", padding: "10px 14px", outline: "none", boxSizing: "border-box", marginBottom: "12px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      />

      <button
        onClick={mostrarQRs}
        disabled={generando}
        style={{ width: "40%", background: `linear-gradient(135deg, rgba(173, 8, 8, 0.53), rgba(173, 8, 8, 0.53))`, border: "none", borderRadius: "10px", color: C.blanco, fontSize: "14px", fontWeight: "700", padding: "12px", cursor: "pointer", marginBottom: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif",   display: "block",
  margin: "0 auto", }}
      >
        {generando ? "Generando..." : `Ver QRs (${tarjetasFiltradas.length} tarjetas)`}
      </button>

      {/* Grid de QRs */}
      {qrVisible.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {qrVisible.map(t => (
            <div key={t.codigoQR} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <img
                src={generarQRIndividual(t.codigoQR)}
                alt={`QR ${t.codigoQR}`}
                style={{ width: "100%", borderRadius: "8px", background: "#fff", padding: "4px" }}
              />
              <p style={{ margin: "8px 0 2px", fontSize: "11px", color: C.amarillo, fontFamily: "monospace" }}>
                #{String(t.numeracion).padStart(3, "0")}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: "11px", color: C.blanco, fontWeight: "600", lineHeight: 1.3 }}>
                {t.nombreCancion}
              </p>
              <button
                onClick={() => descargarQR(t.codigoQR, t.nombreCancion)}
                style={{ background: "rgba(249,190,12,0.1)", border: "1px solid rgba(249,190,12,0.3)", borderRadius: "6px", color: C.amarillo, fontSize: "11px", padding: "5px 10px", cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Descargar ↓
              </button>
            </div>
          ))}
        </div>
      )}

      {qrVisible.length > 0 && tarjetasFiltradas.length > 20 && (
        <p style={{ textAlign: "center", color: C.blancoTenue, fontSize: "12px", marginTop: "16px" }}>
          Mostrando 20 de {tarjetasFiltradas.length}. Usa el buscador para filtrar.
        </p>
      )}
    </div>
  );
}

// =============================================
// COMPONENTE PRINCIPAL: PantallaAdmin
// =============================================
export default function PantallaAdmin() {
  const navigate = useNavigate();

  const [autenticado, setAutenticado] = useState(() => sessionStorage.getItem("adminAuth") === "true");
  const [password,    setPassword]    = useState("");
  const [errorPass,   setErrorPass]   = useState("");
  const [seccion,     setSeccion]     = useState("stats");
  const [tarjetas,    setTarjetas]    = useState([]);
  const [cargando,    setCargando]    = useState(false);

  useEffect(() => {
    if (autenticado) cargarTarjetas();
  }, [autenticado]);

  const cargarTarjetas = async () => {
    setCargando(true);
    try {
      const res  = await fetch(`${API_URL}/api/tarjetas`);
      const data = await res.json();
      setTarjetas(Array.isArray(data.tarjetas) ? data.tarjetas : []);
    } catch {
      console.error("Error al cargar tarjetas");
    } finally {
      setCargando(false);
    }
  };

  const handleLogin = () => {
    if (password === CONTRASENA) {
      sessionStorage.setItem("adminAuth", "true");
      setAutenticado(true);
    } else {
      setErrorPass("Contraseña incorrecta");
      setTimeout(() => setErrorPass(""), 2000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setAutenticado(false);
  };

// ── PANTALLA DE LOGIN ─────────────────────────────────────────────────────
if (!autenticado) {
  return (
    <div style={{ minHeight: "100vh", background: "#100e0b", display: "flex", position: "relative", overflow: "hidden" }}>

      {/* Spectral Edge - Layer 1 */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.04) 32%, rgba(6,182,212,0.18) 45%, rgba(34,197,94,0.22) 51%, rgba(250,204,21,0.20) 57%, rgba(244,63,94,0.18) 64%, transparent 82%)", mixBlendMode: "screen", filter: "blur(75px)", pointerEvents: "none", transform: "translateZ(0)" }} />

      {/* Spectral Edge - Layer 2 */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(102deg, transparent 38%, rgba(255,255,255,0.22) 46%, rgba(125,211,252,0.14) 51%, transparent 60%)", mixBlendMode: "screen", filter: "blur(40px)", opacity: 0.85, pointerEvents: "none", transform: "translateZ(0)" }} />

      {/* Spectral Edge - Layer 3 */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 25% 65% at 92% 50%, rgba(139,92,246,0.16) 0%, transparent 78%)", mixBlendMode: "screen", filter: "blur(88px)", opacity: 0.8, pointerEvents: "none", transform: "translateZ(0)" }} />

      {/* Contenido encima */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px" }}>
        <div style={{ background: "rgba(0, 0, 0, 0.40)", borderRadius: "20px", padding: "36px 28px", width: "100%", maxWidth: "360px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}></div>
          <h1 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "500",fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.blanco }}>PANEL DE ADMINISTRADOR</h1>
          <p style={{ margin: "0 0 24px", fontSize: "12px",fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.blancoTenue }}>SKZ ALBUM</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
            style={{ width: "100%", background: "rgba(0, 0, 0, 0.4)", border: `0px solid ${errorPass ? C.rojo : "rgba(50,54,162,0.4)"}`, borderRadius: "8px", color: C.blanco, fontSize: "15px", padding: "12px 14px", outline: "none", boxSizing: "border-box", marginBottom: "8px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          />
          {errorPass && <p style={{ margin: "0 0 8px", fontSize: "12px", color: C.rojo }}>{errorPass}</p>}
          <button
            onClick={handleLogin}
            style={{ width: "70%", background: "linear-gradient(20deg, rgba(0, 0, 0, 0.67), #000000a2)", border: "none", borderRadius: "15px", color: C.blanco, fontSize: "16px", fontWeight: "600", padding: "14px", cursor: "pointer", marginBottom: "27px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Entrar
          </button>
          <button onClick={() => navigate("/")} style={{ background: "transparent", border: "0px solid rgb(152,153,175)", fontFamily: "'Segoe UI', system-ui, sans-serif",color: C.blanco, padding: "4px 11px", borderRadius: "8px", fontWeight: "600", fontSize: "9px", cursor: "pointer" }}>
            ← Volver al álbum
          </button>
        </div>
      </div>
    </div>
  );
}

 
  // ── DASHBOARD ─────────────────────────────────────────────────────────────

 return (
    <div 
      style={{ 
        position: "relative", 
        minHeight: "100vh", 
        overflow: "hidden",
        fontFamily: "'Segoe UI', system-ui, sans-serif", 
        color: C.blanco,
        backgroundColor: "#100e0b" /* Color base para el cuerpo/fondo según las instrucciones del Spectral Edge */
      }}
    >
      {/* Capas del Aura Gradient: Spectral Edge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.04) 32%, rgba(6,182,212,0.18) 45%, rgba(34,197,94,0.22) 51%, rgba(250,204,21,0.20) 57%, rgba(244,63,94,0.18) 64%, transparent 82%)",
          mixBlendMode: "screen",
          filter: "blur(75px)",
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(102deg, transparent 38%, rgba(255,255,255,0.22) 46%, rgba(125,211,252,0.14) 51%, transparent 60%)",
          mixBlendMode: "screen",
          filter: "blur(40px)",
          opacity: 0.21,
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 25% 65% at 92% 50%, rgba(139,92,246,0.16) 0%, transparent 78%)",
          mixBlendMode: "screen",
          filter: "blur(88px)",
          opacity: 0.8,
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
        aria-hidden="true"
      />

      {/* Contenido Principal (Sita por encima con zIndex: 1) */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
       
 {/* Header */}
<header style={{ background: "rgba(25, 27, 27, 0.75)", borderBottom: "0px solid rgba(50,54,162,0.3)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
  
  {/* Contenedor del texto de la esquina alineado verticalmente */}
  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
    <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: C.blanco,fontFamily: "'Segoe UI', system-ui, sans-serif", lineHeight: "1.2" }}> PANEL DE ADMINISTRADOR</h1>
    <p style={{ margin: 0, fontSize: "10px", color: C.blancoTenue, letterSpacing: "1px", lineHeight: "1.2" }}>SKZ VIRTUAL ALBUM</p>
  </div>
  
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <button onClick={cargarTarjetas} style={{ background: "rgba(15, 15, 17, 0.2)", border: "0px solid rgba(50,54,162,0.4)", borderRadius: "8px", color: C.blanco, fontSize: "12px", padding: "6px 12px", cursor: "pointer" }}>
      🔄 Actualizar
    </button>
    <button onClick={handleLogout} style={{ background: "rgba(231,76,60,0.1)", border: "0px solid rgba(231,76,60,0.3)", borderRadius: "8px", color: C.rojo, fontSize: "12px", padding: "6px 12px", cursor: "pointer" }}>
      Salir
    </button>
  </div>
</header>

        {/* Tabs */}
        <div style={{ background: "rgba(27, 31, 32, 0.4)", borderBottom: "0px solid rgba(14, 11, 11, 0.06)", padding: "0 24px", display: "flex", gap: "4px", backdropFilter: "blur(8px)" }}>
          {[
            { id: "stats",  label: "📊 Estadísticas" },
            { id: "dedics", label: "💌 Dedicatorias" },
            { id: "qr",     label: "📱 Generar QR" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSeccion(tab.id)}
              style={{ background: "transparent", border: "none", borderBottom: seccion === tab.id ? `2px solid rgba(231, 8, 8, 0.9)` : "2px solid transparent", color: seccion === tab.id ? C.blanco : C.blancoTenue, fontSize: "13px", fontWeight: seccion === tab.id ? "700" : "400", padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <main style={{ maxWidth: "900px", width: "100%", margin: "0 auto", padding: "28px 24px", flex: 1 }}>
          {cargando ? (
            <div style={{ textAlign: "center", padding: "60px", color: C.blancoTenue }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
              <p>Cargando datos...</p>
            </div>
          ) : (
            <>
              {seccion === "stats"  && <Estadisticas tarjetas={tarjetas} />}
              {seccion === "dedics" && <Dedicatorias tarjetas={tarjetas} />}
              {seccion === "qr"     && <GenerarQR    tarjetas={tarjetas} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}