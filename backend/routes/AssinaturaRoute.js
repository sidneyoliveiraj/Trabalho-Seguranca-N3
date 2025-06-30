const express = require('express');
const router = express.Router();
const assinaturaController = require('../controllers/AssinaturaController');

// Criar assinatura digital de um relatório 
router.post('/', assinaturaController.criarAssinatura);

// Listar todas as assinaturas digitais
router.get('/', assinaturaController.listarAssinaturas || ((req, res) => res.json([])));

// Verificar assinatura digital
router.post('/verificar', assinaturaController.verificarAssinatura);

module.exports = router;
