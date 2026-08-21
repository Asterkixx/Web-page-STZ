import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import PantallaEscanear from "./PantallaEscanear";
import Bienvenida from "./Bienvenida";
import PantallaAdmin from "./PantallaAdmin";
import fondo from "./Straykidsft.jpg";

import { useParams, useNavigate } from "react-router-dom";

function ValidarQR() {
  const { codigoQR } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(`/escanear?codigo=${codigoQR}`);
  }, []);

  return null;
}


const API_URL = "https://web-page-stz.onrender.com";

// PALETA DE COLORES ORIGINAL
const C = {
  azulOscuro:  "#04212F",
  azulMedio:   "#3236A2",
  amarillo:    "#F9BE0C",
  negro:       "#000000",
  blanco:      "#FFFFFF",
  blancoSuave: "rgba(255,255,255,0.7)",
  blancoTenue: "rgba(255,255,255,0.35)",
};

// =============================================
// COMPONENTE: Modal de Tarjeta
// =============================================
function ModalTarjeta({ tarjeta, onCerrar, userId }) {
  const esMia     = tarjeta.usuarioId === userId;
  const bloqueada = !tarjeta.desbloqueada;
  const [imgError, setImgError] = useState(false);
  const numeroLimpio = parseInt(tarjeta.numeracion, 10);
  const rutaFoto     = `/tarjetas/${numeroLimpio}.jpg`;

  // Formatear fecha
  const fechaFormateada = tarjeta.fechaReclamo
    ? new Date(tarjeta.fechaReclamo).toLocaleDateString("es-CO", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  // Extraer nombre legible del usuarioId
  const nombreUsuario = tarjeta.usuarioId
    ? tarjeta.usuarioId.replace("user_", "").replace(/_/g, " ")
    : null;

  return (
    <div
      onClick={onCerrar}
      style={{
        position:        "fixed",
        inset:           0,
        background:      "rgba(0,0,0,0.85)",
        zIndex:          1000,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "24px",
        backdropFilter:  "blur(6px)",
        animation:       "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:    "linear-gradient(160deg, #0a0a12, #04212F)",
          border:        `1px solid ${bloqueada ? "rgba(255,255,255,0.1)" : "rgba(249,190,12,0.4)"}`,
          borderRadius:  "20px",
          padding:       "28px 24px",
          width:         "100%",
          maxWidth:      "340px",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "16px",
          boxShadow:     bloqueada
            ? "0 20px 60px rgba(0,0,0,0.6)"
            : "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(249,190,12,0.1)",
          position:      "relative",
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          style={{
            position:     "absolute",
            top:          "12px",
            right:        "12px",
            background:   "rgba(255,255,255,0.08)",
            border:       "none",
            borderRadius: "50%",
            width:        "28px",
            height:       "28px",
            color:        "rgba(255,255,255,0.6)",
            cursor:       "pointer",
            fontSize:     "14px",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
          }}
        >✕</button>

        {/* Número */}
        <span style={{
          fontSize:      "10px",
          color:         bloqueada ? "rgba(255,255,255,0.3)" : "rgba(249,190,12,0.8)",
          fontFamily:    "monospace",
          letterSpacing: "3px",
        }}>
          TARJETA #{String(tarjeta.numeracion).padStart(3, "0")}
        </span>

        {/* Imagen o placeholder */}
        <div style={{
          width:        "200px",
          height:       "280px",
          borderRadius: "12px",
          overflow:     "hidden",
          border:       `1px solid ${bloqueada ? "rgba(255,255,255,0.08)" : "rgba(249,190,12,0.3)"}`,
          background:   "#04212F",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          flexShrink:   0,
        }}>
          {!bloqueada && !imgError ? (
            <img
              src={rutaFoto}
              alt={tarjeta.nombreCancion}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: "64px", opacity: 0.4 }}>
              {bloqueada ? "🔒" : esMia ? "⭐" : "🎵"}
            </div>
          )}
        </div>

        {/* Info */}
        {bloqueada ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "rgba(255,255,255,0.4)" }}>
              Sin reclamar
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>
              Esta tarjeta aún está disponible
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            {/* Álbum */}
            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "rgba(50,54,162,0.9)", letterSpacing: "3px", textTransform: "uppercase", fontWeight: "700" }}>
              {tarjeta.album}
            </p>

            {/* Nombre canción */}
            <h3 style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "900", fontStyle: "italic", color: "#FFFFFF", lineHeight: 1.2 }}>
              {tarjeta.nombreCancion}
            </h3>

            {/* Divisor */}
            <div style={{ height: "1px", background: "rgba(249,190,12,0.2)", margin: "0 0 16px" }} />

            {/* Reclamada por */}
            <div style={{
              background:   "rgba(249,190,12,0.06)",
              border:       "1px solid rgba(249,190,12,0.15)",
              borderRadius: "10px",
              padding:      "12px 16px",
              textAlign:    "left",
            }}>
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

              {tarjeta.dedicatoria && (
  <div style={{
    marginTop: "10px",
    background: "rgba(249,190,12,0.06)",
    border: "1px solid rgba(249,190,12,0.15)",
    borderRadius: "8px",
    padding: "10px 14px",
    textAlign: "left",
  }}>
    <p style={{ margin: "0 0 4px", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>
      Dedicatoria
    </p>
    <p style={{ margin: 0, fontSize: "13px", color: "#FFFFFF", fontStyle: "italic", lineHeight: 1.5 }}>
      "{tarjeta.dedicatoria}"
    </p>
  </div>
)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// COMPONENTE: Tarjeta Individual
// =============================================
function Tarjeta({ tarjeta, userId, animando }) {
  const esMia     = tarjeta.usuarioId === userId;
  const bloqueada = !tarjeta.desbloqueada;
  const [hover,       setHover]       = useState(false);
  const [imgError,    setImgError]    = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const numeroLimpio = parseInt(tarjeta.numeracion, 10);
  const rutaFoto     = `/tarjetas/${numeroLimpio}.jpg`;

  return (
    <>
      {/* Modal */}
      {modalAbierto && (
        <ModalTarjeta
          tarjeta={tarjeta}
          onCerrar={() => setModalAbierto(false)}
          userId={userId}
        />
      )}

      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>

        {/* Número ENCIMA */}
        <span style={{ fontSize: "14px", color: "rgb(255,255,255)", fontFamily: "monospace", letterSpacing: "2px", fontWeight: "700" }}>
          {String(tarjeta.numeracion).padStart(3, "0")}
        </span>

        {/* Tarjeta clickeable */}
        <div
          onClick={() => setModalAbierto(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width:      "90px",
            height:     "130px",
            borderRadius: "15px",
            cursor:     "pointer",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            transform:  animando ? "scale(1.1)" : hover ? "translateY(-4px) scale(1.03)" : "scale(1)",
            border:     esMia
              ? `2px solid rgb(156, 17, 17)`
              : bloqueada
              ? `1px solid rgba(0,0,0,0.5)`
              : `1px solid rgba(255,255,255,0)`,
            boxShadow:  animando
              ? `0 0 28px rgba(0,0,0,0.9)`
              : esMia
              ? `0 4px 8px rgba(145, 15, 15, 0.68)`
              : hover
              ? `0 10px 28px rgba(255, 255, 255, 0.2)`
              : `0 2px 8px rgba(0,0,0,0.5)`,
            userSelect: "none",
            position:   "relative",
            overflow:   "hidden",
            background: "#04212F",
          }}
        >
          {/* Imagen o fallback */}
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

          {/* Badge TUYA */}
          {esMia && (
            <span style={{ position: "absolute", top: "6px", right: "6px", background: "#F9BE0C", color: "#000", fontSize: "6px", fontWeight: "800", padding: "2px 5px", borderRadius: "3px", zIndex: 3 }}>
              TUYA
            </span>
          )}

          {/* Brillo superior */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: esMia ? `linear-gradient(90deg, transparent, #F9BE0C, transparent)` : `linear-gradient(90deg, transparent, rgb(0,0,0), transparent)`, zIndex: 3 }} />
        </div>

        {/* Nombre DEBAJO */}
        <p style={{ margin: 0, fontSize: "15px", fontStyle: "italic", letterSpacing: "2px", color: bloqueada ? "rgba(255,255,255,0.35)" : "#FFFFFF", fontWeight: bloqueada ? "400" : "700", textAlign: "center", maxWidth: "120px", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {bloqueada ? "???" : tarjeta.nombreCancion}
        </p>
      </div>
    </>
  );
}


// =============================================
// COMPONENTE: Sección de Álbum (scroll horizontal)
// =============================================
function SeccionAlbum({ nombre, tarjetas, tarjetasFiltradas, onReclamar, userId, animando }) {
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

      {/* Cabecera del álbum */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "12px", color: C.azulMedio, fontWeight: "700", letterSpacing: "5px", textTransform: "uppercase" }}>
            álbum
          </p>
          <h2 style={{ margin: 0, fontSize: "30px", fontWeight: "900", color: C.blanco, letterSpacing: "2px", fontStyle: "italic", lineHeight: 1 }}>
            {nombre}
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 4px", fontSize: "14px", fontFamily: "monospace", color: desbloqueadas === total ? "#ffffff" : C.amarillo }}>
            {desbloqueadas}/{total} desbloqueadas
          </p>
          <div style={{ width: "120px", height: "7px", background: "rgb(95, 9, 9)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${porcentajeAlbum}%`, background: `rgba(249, 225, 12, 0.97)`, borderRadius: "2px", transition: "width 0.6s ease" }} />
          </div>
        </div>
      </div>

      {/* Contenedor scroll horizontal */}
      <div style={{ position: "relative", padding: "0 24px" }}>
        <button onClick={() => scroll(-1)} style={{ position: "absolute", left: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `rgba(4,33,47,0.9)`, border: `0px solid ${C.azulMedio}`, borderRadius: "50%", width: "32px", height: "32px", color: C.blanco, cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>

        <div ref={scrollRef} style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px", paddingTop: "4px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {tarjetasFiltradas.map((tarjeta) => (
            <Tarjeta key={tarjeta.codigoQR} tarjeta={tarjeta} onReclamar={onReclamar} userId={userId} animando={animando === tarjeta.codigoQR} />
          ))}
        </div>

        <button onClick={() => scroll(1)} style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: `rgba(4,33,47,0.9)`, border: `0px solid ${C.azulMedio}`, borderRadius: "50%", width: "32px", height: "32px", color: C.blanco, cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      <div style={{ height: "4px", background: "rgba(165, 0, 0, 0.2)", marginTop: "16px" }} />
    </div>
  );
}

// =============================================
// COMPONENTE: Toast
// =============================================
function Toast({ mensaje, tipo, visible }) {
  return (
    <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: `translateX(-50%) translateY(${visible ? "0" : "80px"})`, opacity: visible ? 1 : 0, transition: "all 0.3s ease", background: tipo === "exito" ? "#0a1f0a" : tipo === "error" ? "#1f0a0a" : C.azulOscuro, border: `1px solid ${tipo === "exito" ? "#4CAF50" : tipo === "error" ? "#e74c3c" : C.amarillo}`, color: tipo === "exito" ? "#7ED87E" : tipo === "error" ? "#E87E7E" : C.amarillo, padding: "12px 24px", borderRadius: "8px", fontSize: "14px", zIndex: 1000, whiteSpace: "nowrap", boxShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
      {mensaje}
    </div>
  );
}

// =============================================
// COMPONENTE PRINCIPAL: AlbumPrincipal
// =============================================
function AlbumPrincipal() {
  const [tarjetas,  setTarjetas]  = useState([]);
  const [filtro,    setFiltro]    = useState("todas");
  const [toast,     setToast]     = useState({ visible: false, mensaje: "", tipo: "info" });
  const [animando,  setAnimando]  = useState(null);
  const [cargando,  setCargando]  = useState(true);
  
  // Mantenemos este estado por si lo usas en otra parte de la lógica (ej. websockets)
  const [conectado, setConectado] = useState(false);

  const [userId] = useState(() => {
    const g = localStorage.getItem("albumUserId");
    if (g) return g;
    const n = "usuario_" + Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem("albumUserId", n);
    return n;
  });

  const toastTimerRef = useRef(null);

  const mostrarToast = useCallback((mensaje, tipo = "info") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, mensaje, tipo });
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/tarjetas`);
        const data = await res.json();
        setTarjetas(Array.isArray(data.tarjetas) ? data.tarjetas : []);
      } catch {
        mostrarToast("No se pudo conectar con el backend", "error");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [mostrarToast]);

  useEffect(() => {
    const socket = io(API_URL);
    socket.on("connect",    () => setConectado(true));
    socket.on("disconnect", () => setConectado(false));
    socket.on("tarjeta_reclamada", ({ tarjetaId, usuarioId: rec }) => {
      setTarjetas((prev) => prev.map((t) => t.codigoQR === tarjetaId ? { ...t, desbloqueada: true, usuarioId: rec } : t));
      setAnimando(tarjetaId);
      setTimeout(() => setAnimando(null), 800);
    });
    return () => socket.disconnect();
  }, []);

  const reclamarTarjeta = useCallback(async (codigoQR) => {
    try {
      const res  = await fetch(`${API_URL}/api/tarjetas/reclamar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ codigoQR, usuarioId: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setTarjetas((prev) => prev.map((t) => t.codigoQR === codigoQR ? { ...t, desbloqueada: true, usuarioId: userId } : t));
        setAnimando(codigoQR);
        setTimeout(() => setAnimando(null), 800);
        mostrarToast(`¡Desbloqueaste "${data.tarjeta?.nombreCancion}"! ✨`, "exito");
      } else {
        mostrarToast(data.mensaje || "Esta tarjeta ya fue reclamada", "error");
      }
    } catch {
      mostrarToast("Error al conectar con el servidor", "error");
    }
  }, [userId, mostrarToast]);

  const totalDesbloqueadas = tarjetas.filter((t) => t.desbloqueada).length;
  const totalMias          = tarjetas.filter((t) => t.usuarioId === userId).length;
  const porcentaje         = Math.round((totalDesbloqueadas / 230) * 100);

  const albumesMap = tarjetas.reduce((acc, t) => {
    const a = t.album || "Otras";
    if (!acc[a]) acc[a] = [];
    acc[a].push(t);
    return acc;
  }, {});

  const filtrarTarjetas = (lista) => lista.filter((t) => {
    if (filtro === "desbloqueadas") return t.desbloqueada;
    if (filtro === "bloqueadas")    return !t.desbloqueada;
    if (filtro === "mias")          return t.usuarioId === userId;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.53), rgba(0, 0, 0, 0.66)), url(${fondo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: C.blanco, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* HEADER MINIMALISTA */}
      <header style={{ background: "rgba(0, 0, 0, 0.88)", borderBottom: `0px solid rgb(0, 0, 0)`, backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
       
        {/* CONTENEDOR PRINCIPAL: Altura reducida a 200px para el logo solitario */}
        <div style={{ 
          maxWidth: "400px", 
          height: "100px", 
          margin: "0 auto", 
          padding: "16px 24px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          boxSizing: "border-box" 
        }}>
          
          {/* Logo Únicamente */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src="/skz-logo.png"
              alt="SKZ Virtual Album"
              style={{
                height: "80px",
                width: "auto",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        </div>

        {/* BARRA DE PROGRESO INFERIOR */}
        <div style={{ height: "10px", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${porcentaje}%`, background: `rgba(249, 40, 12, 0.34)`, transition: "width 0.6s ease" }} />
        </div>
      </header>

      {/* HERO STRIP (Donde ahora recae la información estadística) */}
      <div style={{ background: "rgba(15, 12, 12, 0.86)", borderBottom: `0px solid rgba(0, 0, 0, 0.61)`, padding: "10px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px", color: C.blancoTenue, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Progreso del álbum</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "48px", fontWeight: "900", color: C.amarillo, lineHeight: 1 }}>{porcentaje}</span>
              <span style={{ fontSize: "20px", color: C.blanco, fontWeight: "300" }}>%</span>
              <span style={{ fontSize: "14px", color: C.blancoSuave, marginLeft: "8px" }}>{totalDesbloqueadas} de 230 tarjetas desbloqueadas</span>
            </div>
          </div>  
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" ,borderRadius: "20px",whiteSpace: "nowrap", overflow: "hidden", padding: "4px" }}>
            {[
              { id: "todas",         label: "Todas" },
              { id: "desbloqueadas", label: `Desbloqueadas (${totalDesbloqueadas})` },
              { id: "bloqueadas",    label: `Sin reclamar (${230 - totalDesbloqueadas})` },
              { id: "mias",          label: `Mis tarjetas (${totalMias})` },
            ].map((f) => (
              <button key={f.id} onClick={() => setFiltro(f.id)} style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: filtro === f.id ? "700" : "400", background: filtro === f.id ? C.amarillo : "rgba(255,255,255,0.06)", border: filtro === f.id ? "none" : `1px solid rgba(255,255,255,0.12)`, color: filtro === f.id ? C.negro : C.blancoSuave, cursor: "pointer", transition: "all 0.2s ease" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 12px" }}>
        {cargando ? (
          <div style={{ textAlign: "center", padding: "100px 20px", color: C.amarillo }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
            <p style={{ fontSize: "16px", color: C.blancoTenue }}>Cargando tu álbum...</p>
          </div>
        ) : (
          Object.entries(albumesMap).map(([nombre, tarjetasAlbum]) => (
            <SeccionAlbum key={nombre} nombre={nombre} tarjetas={tarjetasAlbum} tarjetasFiltradas={filtrarTarjetas(tarjetasAlbum)} onReclamar={reclamarTarjeta} userId={userId} animando={animando} />
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid rgba(172,172,176,0.2)`, padding: "20px 24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "14px", color: C.blancoTenue, letterSpacing: "3px" }}>
          Bienvenido {userId}
        </p>
      </footer>

      <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} />
    </div>
  );
}

// =============================================
// EXPORT
// =============================================


export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Bienvenida />} />
      <Route path="/album"    element={<AlbumPrincipal />} />
      <Route path="/escanear" element={<PantallaEscanear />} />
       <Route path="/admin"  element={<PantallaAdmin />} />
       <Route path="/validar/:codigoQR" element={<ValidarQR />} />
    </Routes>
  );
}
