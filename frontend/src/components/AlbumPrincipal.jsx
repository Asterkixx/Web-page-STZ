import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { C, FONTS, API_URL } from "./theme";
import SeccionAlbum from "./SeccionAlbum";
import Toast from "./Toast";
import Footer from "./Footer";
import fondo from "../Straykidsft.jpg";

export default function AlbumPrincipal() {
  const [tarjetas,  setTarjetas]  = useState([]);
  const [filtro,    setFiltro]    = useState("todas");
  const [toast,     setToast]     = useState({ visible: false, mensaje: "", tipo: "info" });
  const [animando,  setAnimando]  = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [, setConectado] = useState(false);

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
  const totalTarjetas      = tarjetas.length || 1;
  const porcentaje         = Math.round((totalDesbloqueadas / totalTarjetas) * 100);

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
      paddingBottom: "80px" // Espacio para que el footer no tape el contenido
    }}>

      {/* HEADER CON LOGO Y BARRA DE PROGRESO */}
      <header style={{ background: "rgba(0, 0, 0, 0)", borderBottom: `0px solid rgb(0, 0, 0)`, backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 100 }}>
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

        <div style={{ height: "10px", background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${porcentaje}%`, background: `rgba(249, 40, 12, 0.34)`, transition: "width 0.6s ease" }} />
        </div>
      </header>

      {/* HERO STRIP CENTRADO */}
      <div style={{ background: "rgba(66, 15, 15, 0.12)", borderBottom: `0px solid rgba(0, 0, 0, 0.61)`, padding: "12px 16px" }}>
        <div style={{ 
          width: "100%",
          maxWidth: "900px", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "10px", 
          padding: "2px 0",
        }}>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            width: "100%", 
            textAlign: "center" 
          }}>
            <p style={{ 
              margin: "0 0 0 0", 
              fontSize: "11px", 
              fontFamily: FONTS.cuerpo, 
              color: C.blancoTenue, 
              letterSpacing: "2px", 
              textTransform: "uppercase",
              width: "100%",
              textAlign: "center" 
            }}>
              Progreso del álbum
            </p>

            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "48px", fontWeight: "900", color: C.amarillo, lineHeight: 1 }}>{porcentaje}</span>
              <span style={{ fontSize: "20px", color: C.blanco, fontWeight: "300" }}>%</span>
              <span style={{ fontSize: "14px", fontFamily: FONTS.cuerpo, color: C.blancoSuave, marginLeft: "8px" }}>
                {totalDesbloqueadas} de {totalTarjetas} tarjetas desbloqueadas
              </span>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            gap: "8px", 
            flexWrap: "wrap", 
            justifyContent: "center", 
            borderRadius: "20px", 
            fontFamily: FONTS.cuerpo, 
            padding: "4px" 
          }}>
            {[
              { id: "todas",         label: "Todas" },
              { id: "desbloqueadas", label: `Desbloqueadas (${totalDesbloqueadas})` },
              { id: "bloqueadas",    label: `Sin reclamar (${totalTarjetas - totalDesbloqueadas})` },
              { id: "mias",          label: `Mis tarjetas (${totalMias})` },
            ].map((f) => (
              <button 
                key={f.id} 
                onClick={() => setFiltro(f.id)} 
                style={{ 
                  padding: "8px 16px", 
                  borderRadius: "20px", 
                  fontSize: "12px", 
                  fontWeight: filtro === f.id ? "700" : "400", 
                  background: filtro === f.id ? C.amarillo : "rgba(255,255,255,0.06)", 
                  border: filtro === f.id ? "none" : `1px solid rgba(255,255,255,0.12)`, 
                  color: filtro === f.id ? C.negro : C.blancoSuave, 
                  cursor: "pointer", 
                  transition: "all 0.2s ease" 
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: ÁLBUMES */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 12px" }}>
        {cargando ? (
          <div style={{ textAlign: "center", padding: "100px 20px", color: C.amarillo }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
            <p style={{ fontSize: "16px", color: C.blancoTenue }}>Cargando tu álbum...</p>
          </div>
        ) : (
          Object.entries(albumesMap).map(([nombre, tarjetasAlbum]) => (
            <SeccionAlbum 
              key={nombre} 
              nombre={nombre} 
              tarjetas={tarjetasAlbum} 
              tarjetasFiltradas={filtrarTarjetas(tarjetasAlbum)} 
              onReclamar={reclamarTarjeta} 
              userId={userId} 
              animando={animando} 
            />
          ))
        )}
      </main>

      <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} />
    </div>
    <Footer />
    </>
  );
}