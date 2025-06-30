const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { auth, permitirCargos } = require('../middleware/auth');

// Apenas autenticados podem criar/listar. Só gerente pode aprovar/rejeitar.
router.get('/', auth, reporteController.listarReportes);
router.post('/', auth, permitirCargos('funcionario', 'gerente'), reporteController.criarReporte);
router.put('/:id/status', auth, permitirCargos('gerente'), reporteController.atualizarStatusReporte);

module.exports = router;
