const crypto = require('crypto');
const Assinatura = require('../models/AssinaturaModel');
const Reporte = require('../models/ReporteModel');
const nodemailer = require('nodemailer');

// ROTA PARA ASSINAR UM RELATÓRIO
exports.criarAssinatura = async (req, res) => {
  try {
    const { reporteId } = req.body;
    const reporte = await Reporte.findById(reporteId);
    if (!reporte) {
      return res.status(404).json({ msg: 'Reporte não encontrado!' });
    }
    const hash = crypto.createHash('sha256')
      .update(reporte.colaborador + reporte.valor + reporte.descricao + reporte.recibo)
      .digest('hex');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const assinaturaDigital = crypto.sign("sha256", Buffer.from(hash), {
      key: privateKey.export({ type: 'pkcs1', format: 'pem' }),
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    }).toString('base64');
    const novaAssinatura = new Assinatura({
      reporte: reporte._id,
      hash,
      chavePublica: publicKey.export({ type: 'pkcs1', format: 'pem' }),
      assinaturaDigital,
    });
    await novaAssinatura.save();

    // ENVIA EMAIL AUTOMÁTICO
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"Sistema Segurança" <' + process.env.EMAIL_USER + '>',
      to: "diretoria@empresa.com", // troque pelo e-mail de destino real
      subject: "Relatório assinado digitalmente",
      text: `O relatório ID ${reporte._id} foi assinado digitalmente.`
    });

    res.status(201).json({ msg: 'Assinatura digital criada e e-mail enviado!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar assinatura digital', erro: err.message });
  }
};

// ROTA PARA VERIFICAR A ASSINATURA DIGITAL
exports.verificarAssinatura = async (req, res) => {
  try {
    const { assinaturaId } = req.body;
    const assinatura = await Assinatura.findById(assinaturaId).populate('reporte');
    if (!assinatura) {
      return res.status(404).json({ msg: 'Assinatura não encontrada!' });
    }
    const hash = crypto.createHash('sha256')
      .update(
        assinatura.reporte.colaborador +
        assinatura.reporte.valor +
        assinatura.reporte.descricao +
        assinatura.reporte.recibo
      )
      .digest('hex');
    const isValid = crypto.verify(
      "sha256",
      Buffer.from(hash),
      {
        key: assinatura.chavePublica,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(assinatura.assinaturaDigital, 'base64')
    );
    if (isValid) {
      res.json({ msg: "Assinatura válida! Documento íntegro e autêntico." });
    } else {
      res.status(400).json({ msg: "Assinatura NÃO é válida." });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao verificar assinatura', erro: err.message });
  }
};
