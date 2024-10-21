const { Op } = require('sequelize');
const Pokemon = require('../models/pokemon.model'); // Ajusta esto según tu proyecto
const Tipo = require('../models/tipo.model');       // Modelo de tipos

exports.getEvolutiveLine = async (req, res) => {
  try {
    const idPokemonActual = req.params.id;
    let objPokemon = await Pokemon.findByPk(idPokemonActual);

    if (!objPokemon) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }

    // Crear una lista para almacenar la línea evolutiva
    const lineaEvolutiva = [];
    const procesados = new Set();  // Usamos un Set para evitar ciclos

    // Agregar el Pokémon actual a la lista de procesados
    procesados.add(idPokemonActual);

    // Función para obtener las evoluciones previas
    const getPreviousEvolutions = async (currentPokemon) => {
      const prevEvolutions = [];
      while (currentPokemon.idEvPrevia && !procesados.has(currentPokemon.idEvPrevia)) {
        const prevPokemon = await Pokemon.findByPk(currentPokemon.idEvPrevia);
        if (prevPokemon && prevPokemon.id != idPokemonActual) {
          prevEvolutions.unshift({
            id: prevPokemon.id,
            nombre: prevPokemon.nombre,
            nroPokedex: prevPokemon.nroPokedex.toString().padStart(4, '0'),
            nivelEvolucion: prevPokemon.nivelEvolucion,
            imagen: prevPokemon.imagen,
            tipo1: prevPokemon.idTipo1,
            tipo2: prevPokemon.idTipo2
          });
          procesados.add(prevPokemon.id); // Marcar como procesado
          currentPokemon = prevPokemon;
        } else {
          break;
        }
      }
      return prevEvolutions;
    };

    // Función para obtener las evoluciones siguientes
    const getNextEvolutions = async (currentPokemon) => {
      const nextEvolutions = [];
      while (currentPokemon.idEvSiguiente && !procesados.has(currentPokemon.idEvSiguiente)) {
        const nextPokemon = await Pokemon.findByPk(currentPokemon.idEvSiguiente);
        if (nextPokemon && nextPokemon.id != idPokemonActual) {
          nextEvolutions.push({
            id: nextPokemon.id,
            nombre: nextPokemon.nombre,
            nroPokedex: nextPokemon.nroPokedex.toString().padStart(4, '0'),
            nivelEvolucion: nextPokemon.nivelEvolucion,
            imagen: nextPokemon.imagen,
            tipo1: nextPokemon.idTipo1,
            tipo2: nextPokemon.idTipo2
          });
          procesados.add(nextPokemon.id); // Marcar como procesado
          currentPokemon = nextPokemon;
        } else {
          break;
        }
      }
      return nextEvolutions;
    };

    // Obtener evoluciones previas
    const prevEvolutions = await getPreviousEvolutions(objPokemon);

    // Agregar el Pokémon actual
    const actualPokemon = {
      id: objPokemon.id,
      nombre: objPokemon.nombre,
      nroPokedex: objPokemon.nroPokedex.toString().padStart(4, '0'),
      nivelEvolucion: objPokemon.nivelEvolucion,
      imagen: objPokemon.imagen,
      tipo1: objPokemon.idTipo1,
      tipo2: objPokemon.idTipo2
    };

    // Obtener evoluciones siguientes
    const nextEvolutions = await getNextEvolutions(objPokemon);

    // Unir todas las evoluciones en una sola línea
    const lineaEvolutivaCompleta = [...prevEvolutions, actualPokemon, ...nextEvolutions];

    res.status(200).json(lineaEvolutivaCompleta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la línea evolutiva', error });
  }
};


// Obtener todos los Pokémon
exports.getAllPokemons = async (req, res) => {
  try {
    // Obtener todos los Pokémon
    const pokemons = await Pokemon.findAll({
      order: [['nroPokedex', 'ASC']]  // Ordenar por nroPokedex ascendente
    });

    // Reemplazar los IDs de los tipos con sus nombres y formatear nroPokedex
    const pokemonsConTipos = await Promise.all(pokemons.map(async (pokemon) => {
      // Obtener los nombres de los tipos basados en los IDs
      const tipo1 = await Tipo.findByPk(pokemon.idTipo1);
      const tipo2 = pokemon.idTipo2 ? await Tipo.findByPk(pokemon.idTipo2) : null;

      return {
        ...pokemon.dataValues,  // Mantener los otros campos del Pokémon
        nroPokedex: pokemon.nroPokedex.toString().padStart(4, '0'),  // Formatear nroPokedex
        Tipo1: tipo1 ? tipo1.nombre : null,  // Reemplazar el ID con el nombre
        Tipo2: tipo2 ? tipo2.nombre : null   // Si hay un tipo2, reemplazar el ID con el nombre
      };
    }));

    res.status(200).json(pokemonsConTipos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los Pokémon', error });
  }
};

// Obtener un Pokémon por ID
exports.getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (pokemon) {
      // Modificar el nroPokedex para que tenga 4 dígitos
      const formattedPokemon = {
        ...pokemon.dataValues,
        nroPokedex: pokemon.nroPokedex.toString().padStart(4, '0')
      };
      res.status(200).json(formattedPokemon);
    } else {
      res.status(404).json({ message: 'Pokémon no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el Pokémon', error });
  }
};


// Crear un nuevo Pokémon
exports.createPokemon = async (req, res) => {
  try {
    const imagen = req.file ? req.file.filename : null;

    const {
      nombre, nroPokedex, idHabilidad1, idHabilidad2, idHabilidad3, 
      idTipo1, idTipo2, descripcion, hp, attack, defense, 
      spattack, spdefense, speed, idEvPrevia, idEvSiguiente, nivelEvolucion
    } = req.body;

    // Crear el Pokémon en la base de datos
    const pokemon = await Pokemon.create({
      nombre,
      nroPokedex,
      idHabilidad1: idHabilidad1 !== 'null' ? idHabilidad1 : null,  // Convertir 'null' a null
      idHabilidad2: idHabilidad2 !== 'null' ? idHabilidad2 : null,  // Convertir 'null' a null
      idHabilidad3: idHabilidad3 !== 'null' ? idHabilidad3 : null,  // Convertir 'null' a null
      idTipo1,
      idTipo2: idTipo2 !== 'null' ? idTipo2 : null,  // Convertir 'null' a null
      descripcion: descripcion || null,
      hp: hp || null,
      attack: attack || null,
      defense: defense || null,
      spattack: spattack || null,
      spdefense: spdefense || null,
      speed,
      imagen,
      idEvPrevia: idEvPrevia !== 'null' ? idEvPrevia : null,  // Convertir 'null' a null
      idEvSiguiente: idEvSiguiente !== 'null' ? idEvSiguiente : null,  // Convertir 'null' a null
      nivelEvolucion: nivelEvolucion || 0
    });
    if (idEvPrevia){
      const pokemonPrevia = await Pokemon.findByPk(idEvPrevia);
      if (pokemonPrevia){
        await pokemonPrevia.update({
          idEvSiguiente: pokemon.id
        });
      }
    }
    if (idEvSiguiente){
      const pokemonSiguiente = await Pokemon.findByPk(idEvSiguiente);
      if (pokemonSiguiente){
        await pokemonSiguiente.update({
          idEvPrevia: pokemon.id
        });
      }
    }

    res.status(201).json(pokemon);
  } catch (error) {
    console.error('Error al crear el Pokémon:', error);
    res.status(500).json({ message: 'Error al crear el Pokémon', error: error.message });
  }
};


  // Actualizar un Pokémon
exports.updatePokemon = async (req, res) => {
  try {
    // Buscar el Pokémon por ID
    const pokemon = await Pokemon.findByPk(req.params.id);

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }

    // Mantener la imagen anterior si no se sube una nueva
    const imagen = req.file ? req.file.filename : pokemon.imagen;

    // Función para verificar si un valor es válido o debe ser nulo
    const parseNullableField = (field) => {
      return field === 'null' || field === '' || field === undefined ? null : field;
    };

    // Actualizar idEvPrevia
    if (req.body.idEvPrevia != null && req.body.idEvPrevia !== pokemon.idEvPrevia) {
      // Eliminar la relación previa si existía
      if (pokemon.idEvPrevia) {
        const previousPokemon = await Pokemon.findByPk(pokemon.idEvPrevia);
        if (previousPokemon) {
          await previousPokemon.update({ idEvSiguiente: null });
        }
      }
      
      // Añadir la nueva relación con idEvPrevia
      const newPreviousPokemon = await Pokemon.findByPk(req.body.idEvPrevia);
      if (newPreviousPokemon) {
        await newPreviousPokemon.update({ idEvSiguiente: pokemon.id });
      }
    } else if (!req.body.idEvPrevia && pokemon.idEvPrevia) {
      // Si se eliminó idEvPrevia, quitar la referencia en el anterior Pokémon
      const previousPokemon = await Pokemon.findByPk(pokemon.idEvPrevia);
      if (previousPokemon) {
        await previousPokemon.update({ idEvSiguiente: null });
      }
    }

    // Actualizar idEvSiguiente
    if (req.body.idEvSiguiente != null && req.body.idEvSiguiente !== pokemon.idEvSiguiente) {
      // Eliminar la relación siguiente si existía
      if (pokemon.idEvSiguiente) {
        const nextPokemon = await Pokemon.findByPk(pokemon.idEvSiguiente);
        if (nextPokemon) {
          await nextPokemon.update({ idEvPrevia: null });
        }
      }

      // Añadir la nueva relación con idEvSiguiente
      const newNextPokemon = await Pokemon.findByPk(req.body.idEvSiguiente);
      if (newNextPokemon) {
        await newNextPokemon.update({ idEvPrevia: pokemon.id });
      }
    } else if (!req.body.idEvSiguiente && pokemon.idEvSiguiente) {
      // Si se eliminó idEvSiguiente, quitar la referencia en el siguiente Pokémon
      const nextPokemon = await Pokemon.findByPk(pokemon.idEvSiguiente);
      if (nextPokemon) {
        await nextPokemon.update({ idEvPrevia: null });
      }
    }

    // Actualizar el Pokémon con los nuevos valores, manejando null para los campos opcionales
    await pokemon.update({
      nombre: req.body.nombre || pokemon.nombre,
      nroPokedex: req.body.nroPokedex || pokemon.nroPokedex,
      descripcion: req.body.descripcion || pokemon.descripcion,
      hp: req.body.hp || pokemon.hp,
      attack: req.body.attack || pokemon.attack,
      defense: req.body.defense || pokemon.defense,
      spattack: req.body.spattack || pokemon.spattack,
      spdefense: req.body.spdefense || pokemon.spdefense,
      speed: req.body.speed || pokemon.speed,
      idTipo1: parseNullableField(req.body.idTipo1),
      idTipo2: parseNullableField(req.body.idTipo2),
      idHabilidad1: parseNullableField(req.body.idHabilidad1),
      idHabilidad2: parseNullableField(req.body.idHabilidad2),
      idHabilidad3: parseNullableField(req.body.idHabilidad3),
      imagen,
      idEvPrevia: parseNullableField(req.body.idEvPrevia),
      idEvSiguiente: parseNullableField(req.body.idEvSiguiente),
      nivelEvolucion: req.body.nivelEvolucion || pokemon.nivelEvolucion
    });

    // Enviar respuesta de éxito con el Pokémon actualizado
    res.status(200).json(pokemon);
  } catch (error) {
    console.error('Error al actualizar el Pokémon:', error);
    res.status(500).json({ message: 'Error al actualizar el Pokémon', error: error.message });
  }
};

// Eliminar un Pokémon
exports.deletePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findByPk(req.params.id);
    if (pokemon) {
      await pokemon.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Pokémon no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el Pokémon', error });
  }
};
