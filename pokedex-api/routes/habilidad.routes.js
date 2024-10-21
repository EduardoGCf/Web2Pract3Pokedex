const express = require('express');
const router = express.Router();
const habilidadController = require('../controllers/habilidad.controller');

router.post('/', habilidadController.createHabilidad);
router.get('/', habilidadController.getAllHabilidades);
router.get('/:id', habilidadController.getHabilidadById);
router.put('/:id', habilidadController.updateHabilidad);
router.delete('/:id', habilidadController.deleteHabilidad);

module.exports = router;
