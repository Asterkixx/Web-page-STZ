// =============================================
// server.js
// Punto de entrada principal del servidor.
// Aquí configuramos Express, Socket.io y
// la conexión a MongoDB.
// =============================================

// Cargamos las variables de entorno PRIMERO que todo
require('dotenv').config();

const express = require('express');
const http = require('http');       // Módulo nativo de Node.js para crear el servidor HTTP
const { Server } = require('socket.io'); // Importamos la clase Server de Socket.io
const mongoose = require('mongoose');
const cors = require('cors');

// Importamos nuestras rutas
const tarjetasRouter = require('./routes/tarjetas');

// =============================================
// 1. CONFIGURACIÓN DE EXPRESS
// =============================================
const app = express();

// Middleware: Permite que el servidor acepte peticiones desde otros orígenes (ej: tu frontend en React)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*', // En producción, cambia '*' por tu dominio real
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Middleware: Permite que Express entienda el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Middleware: Permite entender datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// =============================================
// 2. CREAR EL SERVIDOR HTTP
// =============================================
// IMPORTANTE: Para que Socket.io funcione, debemos crear el servidor HTTP
// a partir de nuestra app de Express, NO directamente con app.listen().
const servidor = http.createServer(app);

// =============================================
// 3. CONFIGURACIÓN DE SOCKET.IO
// =============================================
const io = new Server(servidor, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
  // Configuración para 200 usuarios concurrentes máximo
  // (Socket.io maneja esto bien por defecto, pero lo dejamos documentado)
  maxHttpBufferSize: 1e6, // 1 MB por mensaje
});

// Guardamos la instancia de io en la app de Express para poder
// acceder a ella desde nuestras rutas (ver routes/tarjetas.js)
app.set('io', io);

// Eventos de Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id} | Total: ${io.engine.clientsCount}`);

  // Cuando alguien se desconecta
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id} | Total: ${io.engine.clientsCount}`);
  });

  // Evento personalizado: el cliente puede pedir el contador actual al conectarse
  socket.on('pedir_contador', async () => {
    try {
      const Tarjeta = require('./models/Tarjeta');
      const totalDesbloqueadas = await Tarjeta.contarDesbloqueadas();
      // Emitimos solo a quien lo pidió (socket.emit vs io.emit)
      socket.emit('contador_actual', { totalDesbloqueadas });
    } catch (error) {
      console.error('Error al pedir contador:', error.message);
    }
  });
});

// =============================================
// 4. RUTAS DE LA API
// =============================================

// Ruta de salud del servidor (útil para verificar que todo funciona)
app.get('/', (req, res) => {
  res.json({
    mensaje: '🎵 Álbum Virtual de Concierto - API funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      tarjetas: 'GET /api/tarjetas',
      detalleTarjeta: 'GET /api/tarjetas/:codigoQR',
      reclamar: 'POST /api/reclamar',
    },
  });
});

// Ruta de validación para los QR físicos
// El QR apunta a: tusitio.com/validar/codigo_001
// Esta ruta redirige al frontend con los parámetros necesarios
app.get('/validar/:codigoQR', (req, res) => {
  const { codigoQR } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // Redirigimos al frontend para que maneje la UI del desbloqueo
  res.redirect(`${frontendUrl}/escanear?codigo=${codigoQR}`);
});

// Montamos el router de tarjetas en el prefijo /api
app.use('/api/tarjetas', tarjetasRouter);

// Manejador de rutas no encontradas (debe ir al final, antes del error handler)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Manejador global de errores (Express lo detecta por tener 4 parámetros)
app.use((err, req, res, next) => {
  console.error('💥 Error no manejado:', err.stack);
  res.status(500).json({
    ok: false,
    mensaje: 'Ocurrió un error inesperado en el servidor.',
  });
});

// =============================================
// 5. CONEXIÓN A MONGODB Y ARRANQUE DEL SERVIDOR
// =============================================
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/album_concierto';

const iniciarServidor = async () => {
  try {
    // Conectamos a MongoDB antes de empezar a escuchar peticiones
    console.log('⏳ Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');

    // Una vez conectados a la BD, arrancamos el servidor HTTP
    servidor.listen(PORT, () => {
      console.log('');
      console.log('🎵 ====================================== 🎵');
      console.log(`   Álbum Virtual de Concierto`);
      console.log(`   Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('🎵 ====================================== 🎵');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1); // Salimos con código de error
  }
};

// Manejamos el cierre gracioso del servidor (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ Conexión a MongoDB cerrada correctamente');
  process.exit(0);
});

// ¡Arrancamos!
iniciarServidor();
