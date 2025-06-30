const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  cargo: { type: String, enum: ['funcionario', 'gerente', 'diretor'], default: 'funcionario' },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
