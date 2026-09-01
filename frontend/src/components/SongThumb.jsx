import { useState } from "react";

export default function SongThumb({ numeracion, size = 44, radius = 10, emoji = "🎵" }) {
  const [error, setError] = useState(false);
  const numero = parseInt(numeracion, 10);
  const src = !isNaN(numero) ? `/tarjetas/${numero}.jpg` : "";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        flexShrink: 0,
        background: "#2f040493",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.round(size * 0.45),
      }}
    >
      {!error && src ? (
        <img
          src={src}
          alt=""
          onError={() => setError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span>{emoji}</span>
      )}
    </div>
  );
}