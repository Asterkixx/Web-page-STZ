// =============================================
// seed/desbloquearTodas.js
// Marca todas las tarjetas como desbloqueadas.
//
// USO: npm run desbloquear
//      npm run desbloquear -- user_miNombre   → además las asigna a un usuario
// =============================================
require('dotenv').config();
const mongoose = require('mongoose');
const Tarjeta = require('../models/Tarjeta');

const usuarioId = process.argv[2] || null;

const desbloquear = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/album_concierto';
    console.log('⏳ Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const res = await Tarjeta.updateMany(
      {},
      {
        desbloqueada: true,
        ...(usuarioId ? { usuarioId, fechaReclamo: new Date() } : { $unset: { usuarioId: "", fechaReclamo: "" } }),
      }
    );

    console.log(`🔓 ${res.matchedCount} tarjetas encontradas, ${res.modifiedCount} desbloqueadas.`);
    const total = await Tarjeta.countDocuments({ desbloqueada: true });
    console.log(`✅ Total de tarjetas desbloqueadas ahora: ${total}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

desbloquear();