const Usuario = require('../models/UsuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'E-mail já cadastrado!' });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
      cargo: cargo || 'funcionario',
    });
    await novoUsuario.save();
    res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao registrar usuário', erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }
    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ msg: 'Senha inválida!' });
    }
    const token = jwt.sign(
      { id: usuario._id, cargo: usuario.cargo },
      JWT_SECRET,
      { expiresIn: '4h' }
    );
    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo } });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao fazer login', erro: err.message });
  }
};
