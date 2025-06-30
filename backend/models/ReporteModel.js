const mongoose = require('mongoose');

const ReporteSchema = new mongoose.Schema({
  colaborador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: { type: Date, default: Date.now },
  valor: { type: Number, required: true },
  descricao: { type: String, required: true },
  recibo: { type: String }, // pode ser a URL de um arquivo
  status: { type: String, enum: ['pendente', 'validado', 'assinado'], default: 'pendente' }
});

module.exports = mongoose.model('Reporte', ReporteSchema);
