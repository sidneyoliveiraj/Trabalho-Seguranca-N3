const express = require('express');
const router = express.Router();
const empregadoController = require('../controllers/EmpregadoController');

// Listar todos empregados
router.get('/', empregadoController.listarEmpregados);
// Criar empregado
router.post('/', empregadoController.criarEmpregado);
// Atualizar empregado
router.put('/:id', empregadoController.atualizarEmpregado);
// Remover empregado
router.delete('/:id', empregadoController.deletarEmpregado);

module.exports = router;
