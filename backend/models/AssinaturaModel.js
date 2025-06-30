const mongoose = require('mongoose');

const AssinaturaSchema = new mongoose.Schema({
  reporte: { type: mongoose.Schema.Types.ObjectId, ref: 'Reporte', required: true },
  hash: { type: String, required: true },
  chavePublica: { type: String, required: true },
  assinaturaDigital: { type: String, required: true },
  dataAssinatura: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assinatura', AssinaturaSchema);
