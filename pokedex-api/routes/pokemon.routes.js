const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('imagen'), pokemonController.createPokemon);
router.put('/:id', upload.single('imagen'), pokemonController.updatePokemon);
router.get('/', pokemonController.getAllPokemons);
router.get('/:id', pokemonController.getPokemonById);
router.delete('/:id', pokemonController.deletePokemon);
router.get('/:id/evolutive-line', pokemonController.getEvolutiveLine);

module.exports = router;
