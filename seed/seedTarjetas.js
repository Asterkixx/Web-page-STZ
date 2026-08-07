// =============================================
// seed/seedTarjetas.js
// Script para poblar la base de datos con
// más de 200 tarjetas iniciales.
//
// USO: npm run seed
// ADVERTENCIA: Ejecutar solo una vez al inicio.
// Si ya hay datos, borrará todo y empezará de nuevo.
// =============================================
require('dotenv').config();
const mongoose = require('mongoose');
const Tarjeta = require('../models/Tarjeta');

const ALBUMES = [
  {
    nombre: "MIXTAPE",
    canciones: ["Hellevator","Beware","Spread my wings","YAYAYA","Glow","School life","4419"]
  },
  {
    nombre: "I AM NOT",
    canciones: ["District 9","Mirror","Awaken","Rock","Grow up","3rd Eye"]
  },
  {
    nombre: "I AM WHO",
    canciones: ["My pace","Voices","Question","Insomnia","M.I.A.","Awkward silence"]
  },
  {
    nombre: "I AM YOU",
    canciones: ["I am you","My side","Hero's soup","Get cool","N/S","0325"]
  },
  {
    nombre: "Clé 1: MIROH",
    canciones: ["Miroh","Victory song","Maze of memories","Boxer","Chronosaurus","19"]
  },
  {
    nombre: "Clé 2: YELLOW WOOD",
    canciones: ["Side effects","TMT","Placebo","Behind the light","For you","Broken compass"]
  },
  {
    nombre: "Clé: LEVANTER",
    canciones: ["STOP","Double knot","Levanter","Booster","Astronaut","Sunshine","You can STAY"]
  },
  {
    nombre: "GO LIVE",
    canciones: ["God's menu","Easy","Pacemaker","Airplane","Another day","Phobia","Blueprint","TA","Haven","TOP","Slump","Mixtape: Gone days","Mixtape: On track"]
  },
  {
    nombre: "IN LIFE",
    canciones: ["The tortoise and the hare","Back door","B me","Any","Ex","We go","WOW","My universe"]
  },
  {
    nombre: "ALL IN",
    canciones: ["All in","FAM","One day"]
  },
  {
    nombre: "NOEASY",
    canciones: ["Cheese","Thunderous","Domino","Ssick","The view","Sorry, I love you","Silent cry","Secret secret","Star lost","Red lights","Surfin","Gone away","Wolfgang","Mixtape: OH"]
  },
  {
    nombre: "CHRISTMAS EVEL",
    canciones: ["Christmas eveL","24 to 25","Winter falls"]
  },
  {
    nombre: "ODDINARY",
    canciones: ["Venom","Maniac","Charmer","Freeze","Lonely st.","Waiting for us","Muddy water"]
  },
  {
    nombre: "CIRCUS",
    canciones: ["Circus","Fairytale","Your eyes"]
  },
  {
    nombre: "MAXIDENT",
    canciones: ["Case 143","Chill","Give me your TMI","Super board","3racha","Taste","Can't stop"]
  },
  {
    nombre: "SKZ-REPLAY",
    canciones: ["Connected","Limbo","Doodle","Love untold","RUN","Deep end","Stars and raindrops","Hug me","#LoveSTAY","Zone","Close","Streetlight","I hate to admit","I got it","Miss you","Maknae on top","Alien","Because","Piece of a puzzle","Wish you back","HaPpY","Up all night","Drive","Ice.cream"]
  },
  {
    nombre: "THE SOUND",
    canciones: ["The sound","Battle ground","Lost me","DLMLU","Novel","There"]
  },
  {
    nombre: "5-STAR",
    canciones: ["Hall of fame","S-class","ITEM","Super bowl","TOPLINE","DLC","Get lit","Collision","FNF","Youtiful","Mixtape: Time Out"]
  },
  {
    nombre: "ROCK-STAR",
    canciones: ["Megaverse","LALALALA","Blind spot","Comflex","Cover me","Leave"]
  },
  {
    nombre: "ATE",
    canciones: ["Mountains","Chk Chk Boom","JJAM","I like it","Runners","Twilight","Stray kids"]
  },
  {
    nombre: "GIANT",
    canciones: ["Giant","Night","Falling up","WHY?","Saiyan","愛をくれたのに、なぜ","Christmas love"]
  },
  {
    nombre: "HOP",
    canciones: ["Walking on water","Bounce back","U","Railway","Unfair","Hallucination","Youth","So good","Ultra","Hold my hand","As we are"]
  },
  {
    nombre: "MIXTAPE: dominATE",
    canciones: ["Burnin' tires","Truman","Escape","Cinema"]
  },
  {
    nombre: "HOLLOW",
    canciones: ["Hollow","Parade","Never alone","Just a little","宿命"]
  },
  {
    nombre: "KARMA",
    canciones: ["Bleep","Ceremony","Creed","Mess","In my head","Half time","Phoenix","Ghost","0801"]
  },
  {
    nombre: "DO IT",
    canciones: ["Do it","DIVINE","Holiday","Photobook"]
  },
  {
    nombre: "Otras",
    canciones: ["Scars","Calll","Social path","Butterflies","Hoodie season","Party's not over"]
  },
];

const poblarBaseDeDatos = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/album_concierto';
    console.log('⏳ Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('🗑️  Borrando tarjetas existentes...');
    await Tarjeta.deleteMany({});

    const tarjetas = [];
    let numeracion = 1;

    for (const album of ALBUMES) {
      for (const cancion of album.canciones) {
        const numeroFormateado = String(numeracion).padStart(3, '0');
        tarjetas.push({
          codigoQR: `codigo_${numeroFormateado}`,
          nombreCancion: cancion,
          album: album.nombre,
          numeracion,
          desbloqueada: false,
          usuarioId: null,
          fechaReclamo: null,
          imagenUrl: `/img/tarjetas/tarjeta_${numeroFormateado}.jpg`,
        });
        numeracion++;
      }
    }

    console.log(`⏳ Insertando ${tarjetas.length} tarjetas...`);
    await Tarjeta.insertMany(tarjetas);

    console.log('');
    console.log('🎉 ====================================== 🎉');
    console.log(`   ¡Base de datos poblada exitosamente!`);
    console.log(`   ${tarjetas.length} tarjetas creadas y listas.`);
    console.log('🎉 ====================================== 🎉');

    const count = await Tarjeta.countDocuments();
    console.log(`✅ Verificación: ${count} tarjetas en la base de datos`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

poblarBaseDeDatos();