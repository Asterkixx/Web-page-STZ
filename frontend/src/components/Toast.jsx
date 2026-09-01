export default function Toast({ mensaje, tipo, visible }) {
  const colores = {
    exito: { bg: "#0a1f0a", border: "#4CAF50", text: "#7ED87E" },
    error: { bg: "#1f0a0a", border: "#e74c3c", text: "#E87E7E" },
    info:  { bg: "#04212F", border: "#F9BE0C", text: "#F9BE0C" },
  };
  const c = colores[tipo] || colores.info;

  return (
    <div style={{
      position:        "fixed",
      bottom:          "32px",
      left:            "50%",
      transform:       `translateX(-50%) translateY(${visible ? "0" : "80px"})`,
      opacity:         visible ? 1 : 0,
      transition:      "all 0.3s ease",
      background:      c.bg,
      border:          `1px solid ${c.border}`,
      color:           c.text,
      padding:         "12px 24px",
      borderRadius:    "8px",
      fontSize:        "14px",
      zIndex:          1000,
      whiteSpace:      "nowrap",
      boxShadow:       "0 4px 24px rgba(0,0,0,0.6)",
    }}>
      {mensaje}
    </div>
  );
}
