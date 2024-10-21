const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipo.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('imagen'), tipoController.createTipo);
router.put('/:id', upload.single('imagen'), tipoController.updateTipo);
router.get('/', tipoController.getAllTipos);
router.get('/:id', tipoController.getTipoById);
router.delete('/:id', tipoController.deleteTipo);

module.exports = router;
