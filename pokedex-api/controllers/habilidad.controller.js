const Habilidad = require('../models/habilidad.model');
const Pokemon = require('../models/pokemon.model');
// Crear una nueva Habilidad
exports.createHabilidad = async (req, res) => {
  try {
    const habilidad = await Habilidad.create(req.body);
    res.status(201).json(habilidad);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la habilidad', error });
  }
};

// Obtener todas las Habilidades
exports.getAllHabilidades = async (req, res) => {
  try {
    const habilidades = await Habilidad.findAll();
    res.status(200).json(habilidades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las habilidades', error });
  }
};

// Obtener una Habilidad por ID
exports.getHabilidadById = async (req, res) => {
  try {
    const habilidad = await Habilidad.findByPk(req.params.id);
    if (habilidad) {
      res.status(200).json(habilidad);
    } else {
      res.status(404).json({ message: 'Habilidad no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la habilidad', error });
  }
};

// Actualizar una Habilidad
exports.updateHabilidad = async (req, res) => {
  try {
    const habilidad = await Habilidad.findByPk(req.params.id);
    if (habilidad) {
      await habilidad.update(req.body);
      res.status(200).json(habilidad);
    } else {
      res.status(404).json({ message: 'Habilidad no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la habilidad', error });
  }
};

// Eliminar una Habilidad
exports.deleteHabilidad = async (req, res) => {
  try {
    const habilidad = await Habilidad.findByPk(req.params.id);

    if (habilidad) {
      console.log(`Eliminando habilidad con ID: ${habilidad.id}`);

      // Actualizar los Pokémon que usan esta habilidad
      const updatedPokemonsHabilidad1 = await Pokemon.update({ idHabilidad1: null }, { where: { idHabilidad1: habilidad.id } });
      const updatedPokemonsHabilidad2 = await Pokemon.update({ idHabilidad2: null }, { where: { idHabilidad2: habilidad.id } });
      const updatedPokemonsHabilidad3 = await Pokemon.update({ idHabilidad3: null }, { where: { idHabilidad3: habilidad.id } });

      console.log(`Pokémon actualizados con idHabilidad1 null: ${updatedPokemonsHabilidad1}`);
      console.log(`Pokémon actualizados con idHabilidad2 null: ${updatedPokemonsHabilidad2}`);
      console.log(`Pokémon actualizados con idHabilidad3 null: ${updatedPokemonsHabilidad3}`);

      // Eliminar la habilidad
      await habilidad.destroy();
      res.status(204).json(); // Respuesta sin contenido, eliminación exitosa
    } else {
      res.status(404).json({ message: 'Habilidad no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la habilidad:', error); // Registro detallado del error
    res.status(500).json({ message: 'Error al eliminar la habilidad', error });
  }
};