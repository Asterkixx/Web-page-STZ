// =============================================
// routes/tarjetas.js
// Define todos los endpoints de la API
// relacionados con las tarjetas del álbum.
// =============================================
const express = require('express');
const router = express.Router();
const Tarjeta = require('../models/Tarjeta');

// =============================================
// GET /api/tarjetas
// =============================================
// Devuelve el estado de las 200 tarjetas.
// El frontend usará esto para pintar el álbum
// y mostrar cuáles están bloqueadas/desbloqueadas.
//
// Query params opcionales:
//   ?usuarioId=abc123  → filtra tarjetas de un usuario específico
//   ?desbloqueada=true → solo tarjetas desbloqueadas
// =============================================
router.get('/', async (req, res) => {
  try {
    const filtro = {};

    // Si el frontend pide las tarjetas de un usuario específico
    if (req.query.usuarioId) {
      filtro.usuarioId = req.query.usuarioId;
    }

    // Si el frontend quiere filtrar por estado
    if (req.query.desbloqueada !== undefined) {
      filtro.desbloqueada = req.query.desbloqueada === 'true';
    }

    // Buscamos las tarjetas y las ordenamos por número de colección
    const tarjetas= await Tarjeta.find(filtro)
      .sort({ numeracion: 1 })
      // Seleccionamos qué campos enviar (no enviamos _id de Mongo innecesariamente)
      .select('codigoQR nombreCancion album numeracion desbloqueada usuarioId imagenUrl fechaReclamo');

    // Obtenemos el contador global de tarjetas desbloqueadas
    const totalDesbloqueadas = await Tarjeta.contarDesbloqueadas();

    // Respondemos con los datos
    res.status(200).json({
      ok: true,
      totalTarjetas: tarjetas.length,
      totalDesbloqueadas,
      tarjetas,
    });
  } catch (error) {
    console.error('❌ Error en GET /api/tarjetas:', error.message);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las tarjetas.',
    });
  }
});

// =============================================
// GET /api/tarjetas/:codigoQR
// =============================================
// Devuelve la información de UNA sola tarjeta
// por su código QR. Útil para la vista de detalle.
// =============================================
router.get('/:codigoQR', async (req, res) => {
  try {
    const { codigoQR } = req.params;

    const tarjeta = await Tarjeta.findOne({ codigoQR });

    if (!tarjeta) {
      return res.status(404).json({
        ok: false,
        mensaje: `No se encontró ninguna tarjeta con el código: ${codigoQR}`,
      });
    }

    res.status(200).json({
      ok: true,
      tarjeta,
    });
  } catch (error) {
    console.error('❌ Error en GET /api/tarjetas/:codigoQR:', error.message);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor.',
    });
  }
});

// =============================================
// POST /api/reclamar
// =============================================
// Endpoint principal: procesa el escaneo de un QR.
//
// Body esperado (JSON):
// {
//   "codigoQR": "codigo_001",
//   "usuarioId": "user_abc123"
// }
//
// Lógica:
// 1. Validar que se enviaron los datos necesarios.
// 2. Buscar la tarjeta en la base de datos.
// 3. Si no existe → error 404.
// 4. Si ya fue reclamada → devolver quién la tiene.
// 5. Si está disponible → reclamarla y notificar por Socket.io.
// =============================================
router.post('/reclamar', async (req, res) => {
  try {
    const { codigoQR, usuarioId } = req.body;

    // --- Paso 1: Validación de datos de entrada ---
    if (!codigoQR || !usuarioId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos. Se requieren "codigoQR" y "usuarioId".',
      });
    }

    // --- Paso 2: Buscar la tarjeta en la base de datos ---
    const tarjeta = await Tarjeta.findOne({ codigoQR });

    // --- Paso 3: Verificar que la tarjeta existe ---
    if (!tarjeta) {
      return res.status(404).json({
        ok: false,
        mensaje: `El código QR "${codigoQR}" no corresponde a ninguna tarjeta válida.`,
      });
    }

    // --- Paso 4: Verificar si ya fue reclamada ---
    if (tarjeta.desbloqueada) {
      // La tarjeta ya pertenece a alguien
      const esTuya = tarjeta.usuarioId === usuarioId;

      return res.status(409).json({
        // 409 Conflict = ya existe un estado que impide la acción
        ok: false,
        yaReclamada: true,
        esTuya, // Le decimos al frontend si es del mismo usuario
        mensaje: esTuya
          ? '¡Esta tarjeta ya está en tu álbum! 🎵'
          : 'Esta tarjeta ya fue reclamada por otro usuario.',
        tarjeta,
      });
    }

    // --- Paso 5: Reclamar la tarjeta ---
    // Actualizamos el documento en la BD con los nuevos datos
    tarjeta.desbloqueada = true;
    tarjeta.usuarioId = usuarioId;
    tarjeta.fechaReclamo = new Date();

    const tarjetaActualizada = await tarjeta.save();

    // --- Paso 6: Emitir evento de Socket.io ---
    // Obtenemos la instancia de Socket.io que guardamos en app
    const io = req.app.get('io');

    // Calculamos el nuevo contador global
    const totalDesbloqueadas = await Tarjeta.contarDesbloqueadas();

    // Emitimos el evento a TODOS los clientes conectados
    io.emit('tarjeta_reclamada', {
      totalDesbloqueadas,     
      tarjetaId: tarjetaActualizada.codigoQR,
      numeracion: tarjetaActualizada.numeracion,
      nombreCancion: tarjetaActualizada.nombreCancion,
    });

    console.log(
      `✅ Tarjeta "${codigoQR}" reclamada por usuario "${usuarioId}". Total desbloqueadas: ${totalDesbloqueadas}/200`
    );

    // --- Paso 7: Responder al cliente que hizo el POST ---
    res.status(200).json({
      ok: true,
      mensaje: `¡Felicidades! Desbloqueaste la tarjeta #${tarjetaActualizada.numeracion}: ${tarjetaActualizada.nombreCancion} 🎉`,
      tarjeta: tarjetaActualizada,
      totalDesbloqueadas,
    });
  } catch (error) {
    console.error('❌ Error en POST /api/reclamar:', error.message);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al intentar reclamar la tarjeta.',
    });
  }
});

module.exports = router;
