const express = require('express');
const router = express.Router();
const empregadoController = require('../controllers/EmpregadoController');
const { auth, permitirCargos } = require('../middleware/auth');

// Só gerente pode cadastrar/editar/remover funcionários. Todos autenticados podem ver.
router.get('/', auth, empregadoController.listarEmpregados);
router.post('/', auth, permitirCargos('gerente'), empregadoController.criarEmpregado);
router.put('/:id', auth, permitirCargos('gerente'), empregadoController.atualizarEmpregado);
router.delete('/:id', auth, permitirCargos('gerente'), empregadoController.deletarEmpregado);

module.exports = router;
