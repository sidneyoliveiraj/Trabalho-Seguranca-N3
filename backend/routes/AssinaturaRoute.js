const express = require('express');
const router = express.Router();
const assinaturaController = require('../controllers/AssinaturaController');
const { auth, permitirCargos } = require('../middleware/auth');

// Apenas gerente pode assinar. Todos autenticados podem listar/verificar.
router.post('/', auth, permitirCargos('gerente'), assinaturaController.criarAssinatura);
router.get('/', auth, assinaturaController.listarAssinaturas);
router.post('/verificar', auth, permitirCargos('diretor', 'gerente'), assinaturaController.verificarAssinatura);

module.exports = router;
