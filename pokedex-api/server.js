require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db.config');
const pokemonRoutes = require('./routes/pokemon.routes');
const tipoRoutes = require('./routes/tipo.routes');
const habilidadRoutes = require('./routes/habilidad.routes');
const multer = require('multer');
const usuarioRoutes = require('./routes/usuario.routes');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

// Rutas
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/tipo', tipoRoutes);
app.use('/api/habilidad', habilidadRoutes);
app.use('/api/usuario', usuarioRoutes);
  
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API de Pokedex');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
