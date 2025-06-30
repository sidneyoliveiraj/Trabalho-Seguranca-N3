const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Listar todos reportes
router.get('/', reporteController.listarReportes);
// Criar reporte
router.post('/', reporteController.criarReporte);
// Atualizar status do reporte 
router.put('/:id/status', reporteController.atualizarStatusReporte);

module.exports = router;
