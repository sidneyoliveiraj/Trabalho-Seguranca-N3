const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para cadastro de usuário
router.post('/registrar', authController.registrar);
// Rota para login
router.post('/login', authController.login);

module.exports = router;
