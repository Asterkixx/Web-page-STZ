# 🎵 Álbum Virtual — Frontend React

Frontend para el proyecto de Álbum Virtual de Concierto. Se conecta al backend Express + Socket.io.

## Estructura del proyecto

```
album-virtual/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       ← Punto de entrada React
    └── App.jsx        ← Componente principal (todo el UI)
```

## Instalación

```bash
# Dentro de la carpeta del proyecto
npm install
```

## Desarrollo

```bash
# Inicia el servidor de desarrollo (puerto 5173)
npm run dev
```

> **Importante:** El backend debe estar corriendo en `http://localhost:3000`  
> El `vite.config.js` ya tiene el proxy configurado para evitar errores de CORS.

## Producción

```bash
npm run build   # Genera la carpeta /dist
npm run preview # Previsualiza el build
```

## Configuración

En `src/App.jsx`, línea 5:
```js
const API_URL = "http://localhost:3000"; // ← Cambia esto en producción
```

## Flujo de la aplicación

1. **Al cargar:** llama `GET /api/tarjetas` para obtener el estado de las 200 tarjetas.
2. **Socket.io:** se conecta y escucha el evento `tarjetaReclamada` para actualizar el contador en tiempo real.
3. **Al hacer clic en una tarjeta bloqueada:** llama `POST /api/reclamar` con el `tarjetaId` y el `usuarioId`.
4. **Modo demo:** si el backend no está disponible, funciona con datos locales de ejemplo.

## Rutas del backend esperadas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/tarjetas` | Retorna array de 200 tarjetas con su estado |
| `POST` | `/api/reclamar` | Body: `{ tarjetaId, usuarioId }` |

### Formato de tarjeta esperado (MongoDB/JSON):
```json
{
  "_id": "tarjeta_001",
  "numero": 1,
  "nombre": "Obertura",
  "desbloqueada": false,
  "usuarioId": null
}
```

### Evento Socket.io esperado del backend:
```js
// El backend emite esto cuando alguien reclama una tarjeta:
io.emit("tarjetaReclamada", { tarjetaId: "tarjeta_001", usuarioId: "usuario_ABC123" });
```

## Dependencias

- `react` + `react-dom` — UI
- `socket.io-client` — Tiempo real
- `vite` + `@vitejs/plugin-react` — Build tool
