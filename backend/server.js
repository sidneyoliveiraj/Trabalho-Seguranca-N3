require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/database');

const authRoute = require('./routes/authRoute');
const empregadoRoute = require('./routes/EmpregadoRoute');
const reporteRoute = require('./routes/reporteRoute');
const assinaturaRoute = require('./routes/AssinaturaRoute');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Conecta ao banco
connectDB();

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Rotas
app.use('/api/auth', authRoute);
app.use('/api/empregados', empregadoRoute);
app.use('/api/reportes', reporteRoute);
app.use('/api/assinaturas', assinaturaRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
