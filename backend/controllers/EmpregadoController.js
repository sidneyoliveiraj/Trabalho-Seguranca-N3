const Usuario = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');

exports.listarEmpregados = async (req, res) => {
  try {
    const empregados = await Usuario.find();
    res.json(empregados);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao listar empregados', erro: err.message });
  }
};

exports.criarEmpregado = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'E-mail já cadastrado!' });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoEmpregado = new Usuario({ nome, email, senha: senhaCriptografada, cargo });
    await novoEmpregado.save();
    res.status(201).json({ msg: 'Empregado criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar empregado', erro: err.message });
  }
};

exports.atualizarEmpregado = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }
    await Usuario.findByIdAndUpdate(id, dados);
    res.json({ msg: 'Empregado atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar empregado', erro: err.message });
  }
};

exports.deletarEmpregado = async (req, res) => {
  try {
    const { id } = req.params;
    await Usuario.findByIdAndDelete(id);
    res.json({ msg: 'Empregado removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao remover empregado', erro: err.message });
  }
};
