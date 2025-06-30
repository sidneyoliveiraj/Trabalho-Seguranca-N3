const crypto = require('crypto');
const Assinatura = require('../models/AssinaturaModel');
const Reporte = require('../models/ReporteModel');
const nodemailer = require('nodemailer');


exports.criarAssinatura = async (req, res) => {
  try {
    const { reporteId } = req.body;
    if (!reporteId) return res.status(400).json({ msg: 'reporteId é obrigatório!' });

    
    const reporte = await Reporte.findById(reporteId).populate('colaborador');
    if (!reporte) return res.status(404).json({ msg: 'Reporte não encontrado!' });

    
    const hash = crypto.createHash('sha256')
      .update(
        (reporte.colaborador?.nome || reporte.colaborador) +
        reporte.valor +
        reporte.descricao +
        reporte.recibo
      )
      .digest('hex');

    // Gera par de chaves 
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });

    // Cria assinatura digital
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

    // ENVIO DE E-MAIL 
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: '"Sistema Segurança" <' + process.env.EMAIL_USER + '>',
        to: "diretoria@empresa.com", 
        subject: "Relatório assinado digitalmente",
        text: `O relatório ID ${reporte._id} foi assinado digitalmente.`
      });
    } catch (err) {
      
      console.log('Erro ao enviar e-mail:', err.message);
    }

    res.status(201).json({ msg: 'Assinatura digital criada e e-mail enviado!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar assinatura digital', erro: err.message });
  }
};

// LISTAR ASSINATURAS DIGITAIS 
exports.listarAssinaturas = async (req, res) => {
  try {
    const assinaturas = await Assinatura.find()
      .populate({
        path: 'reporte',
        populate: { path: 'colaborador' }
      });
    res.json(assinaturas);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao listar assinaturas', erro: err.message });
  }
};

// VERIFICAR ASSINATURA DIGITAL
exports.verificarAssinatura = async (req, res) => {
  try {
    const { assinaturaId } = req.body;
    const assinatura = await Assinatura.findById(assinaturaId)
      .populate({
        path: 'reporte',
        populate: { path: 'colaborador' }
      });
    if (!assinatura) {
      return res.status(404).json({ msg: 'Assinatura não encontrada!' });
    }
    
    const hash = crypto.createHash('sha256')
      .update(
        (assinatura.reporte.colaborador?.nome || assinatura.reporte.colaborador) +
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
