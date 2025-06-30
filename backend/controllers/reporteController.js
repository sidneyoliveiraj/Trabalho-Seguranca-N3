const Reporte = require('../models/ReporteModel');

exports.listarReportes = async (req, res) => {
  try {
    const reportes = await Reporte.find().populate('colaborador');
    res.json(reportes);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao listar reportes', erro: err.message });
  }
};

exports.criarReporte = async (req, res) => {
  try {
    const { colaborador, valor, descricao, recibo } = req.body;
    const novoReporte = new Reporte({ colaborador, valor, descricao, recibo });
    await novoReporte.save();
    res.status(201).json({ msg: 'Reporte criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar reporte', erro: err.message });
  }
};

exports.atualizarStatusReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Reporte.findByIdAndUpdate(id, { status });
    res.json({ msg: 'Status do reporte atualizado!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar status do reporte', erro: err.message });
  }
};
