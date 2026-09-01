// =============================================
// models/Tarjeta.js
// Define la estructura (Schema) de cada tarjeta
// en nuestra base de datos MongoDB.
// =============================================

const mongoose = require('mongoose');

/**
 * Schema de Tarjeta
 *
 * Cada documento en la colección "tarjetas" tendrá esta forma:album: {
  type: String,
  default: 'Sin álbum',
  trim: true
 * {
 *   codigoQR:     "codigo_001",          // ID único que va en el QR
 *   nombreCancion: "La Canción del Viento", // Nombre de la tarjeta/canción
 *   artista:      "Nombre del Artista",  // Artista de la canción
 *   numeracion:   1,                     // Número de la tarjeta (1 al 200)
 *   desbloqueada: false,                 // ¿Ya fue escaneada por alguien?
 *   usuarioId:    null,                  // ID del usuario que la reclamó
 *   fechaReclamo: null,                  // Cuándo fue reclamada
 *   imagenUrl:    "/img/tarjeta_001.jpg" // Imagen de la tarjeta (opcional)
 * }
 */
const tarjetaSchema = new mongoose.Schema(
  {
    // Código único que va grabado en el QR físico
    // Ejemplo: "codigo_001", "codigo_042", etc.
    codigoQR: {
      type: String,
      required: [true, 'El código QR es obligatorio'],
      unique: true,
      trim: true, // Elimina espacios al inicio y al final
      index: true, // Crea un índice para búsquedas más rápidas
    },

    // Nombre de la canción o tema de la tarjeta
    nombreCancion: {
      type: String,
      required: [true, 'El nombre de la canción es obligatorio'],
      trim: true,
    },

    // Nombre del álbum al que pertenece la canción
album: {
  type: String,
  default: 'Sin álbum',
  trim: true,
},

    // Número de colección (del 1 al 200)
    numeracion: {
      type: Number,
      required: true,
      min: 1,
      max: 256, // ❌ Error durante el seed: Tarjeta,
    },

    // Estado principal: ¿La tarjeta ha sido reclamada?
    desbloqueada: {
      type: Boolean,
      default: false, // Por defecto, todas empiezan bloqueadas
    },

    // ID del usuario que escaneó y reclamó esta tarjeta
    // Será null mientras nadie la haya reclamado
    usuarioId: {
      type: String,
      default: null,
    },

    // Fecha y hora exacta en que fue reclamada
    fechaReclamo: {
      type: Date,
      default: null,
    },
   
    // Dedicatoria que el usuario puede dejar al reclamar la tarjeta
    dedicatoria: {
  type: String,
  default: null,
  maxlength: 150,
},
    // URL de la canción en Spotify para reproducirla
    spotifyUrl: {
      type: String,
      default: null,
      trim: true,
    },
// URL de la imagen que representa esta tarjeta
    imagenUrl: {
      type: String,
      // Usamos una función tradicional (no arrow function) para poder usar 'this'
      default: function() {

        // Si la tarjeta tiene numeración (ej: 42), genera: "/img/tarjetas/42.jpg"
        return `/tarjetas/${this.numeracion}.jpg`;
      }
    },
    },
  
  {
    // timestamps: true agrega automáticamente los campos:
    // - createdAt: cuándo se creó el documento
    // - updatedAt: cuándo se modificó por última vez
    timestamps: true,
  }
);

// =============================================
// MÉTODO ESTÁTICO: Contar tarjetas desbloqueadas
// =============================================
// Lo usaremos para obtener el contador global fácilmente.
tarjetaSchema.statics.contarDesbloqueadas = async function () {
  return await this.countDocuments({ desbloqueada: true });
};

// Exportamos el modelo para usarlo en otras partes del proyecto
const Tarjeta = mongoose.model('Tarjeta', tarjetaSchema);
module.exports = Tarjeta;
