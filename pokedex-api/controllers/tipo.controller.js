const Pokemon = require('../models/pokemon.model');
const Tipo = require('../models/tipo.model');
// Crear un nuevo Tipo
exports.createTipo = async (req, res) => {
    try {
      const imagen = req.file ? req.file.filename : null;  // Guardar el nombre de la imagen
      const tipoData = { ...req.body, imagen };  // Añadir la imagen a los datos del Tipo
      const tipo = await Tipo.create(tipoData);
      res.status(201).json(tipo);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el tipo', error });
    }
  };
  
  // Actualizar un Tipo
  exports.updateTipo = async (req, res) => {
    try {
      const tipo = await Tipo.findByPk(req.params.id);
      if (tipo) {
        const imagen = req.file ? req.file.filename : tipo.imagen;  // Mantener la imagen anterior si no se sube una nueva
        await tipo.update({ ...req.body, imagen });
        res.status(200).json(tipo);
      } else {
        res.status(404).json({ message: 'Tipo no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el tipo', error });
    }
  };
  

// Obtener todos los Tipos
exports.getAllTipos = async (req, res) => {
  try {
    const tipos = await Tipo.findAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tipos', error });
  }
};

// Obtener un Tipo por ID
exports.getTipoById = async (req, res) => {
  try {
    const tipo = await Tipo.findByPk(req.params.id);
    if (tipo) {
      res.status(200).json(tipo);
    } else {
      res.status(404).json({ message: 'Tipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el tipo', error });
  }
};


// Eliminar un Tipo// Eliminar un Tipo
// Eliminar un Tipo
exports.deleteTipo = async (req, res) => {
  try {
    const tipo = await Tipo.findByPk(req.params.id);

    if (tipo) {
      console.log(`Eliminando tipo con ID: ${tipo.id}`);

      // Actualizar los Pokémon que usan este tipo
      const updatedPokemonsTipo1 = await Pokemon.update({ idTipo1: null }, { where: { idTipo1: tipo.id } });
      const updatedPokemonsTipo2 = await Pokemon.update({ idTipo2: null }, { where: { idTipo2: tipo.id } });

      console.log(`Pokémon actualizados con idTipo1 null: ${updatedPokemonsTipo1}`);
      console.log(`Pokémon actualizados con idTipo2 null: ${updatedPokemonsTipo2}`);

      // Eliminar el tipo
      await tipo.destroy();
      res.status(204).json(); // Respuesta sin contenido, eliminación exitosa
    } else {
      res.status(404).json({ message: 'Tipo no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el tipo:', error); // Registro detallado del error
    res.status(500).json({ message: 'Error al eliminar el tipo', error });
  }
};
