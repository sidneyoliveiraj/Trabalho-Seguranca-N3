import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button, Typography, Container, Box, TextField, MenuItem, Alert
} from "@mui/material";

export default function SubmitExpense() {
  const [colaboradores, setColaboradores] = useState([]);
  const [form, setForm] = useState({
    colaborador: "",
    valor: "",
    descricao: "",
    recibo: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Busca os funcionários para preencher o select
    async function fetchColaboradores() {
      try {
        const resp = await axios.get("http://localhost:5000/api/empregados");
        setColaboradores(resp.data);
      } catch {
        setErro("Erro ao buscar funcionários");
      }
    }
    fetchColaboradores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    try {
      await axios.post("http://localhost:5000/api/reportes", form);
      setMensagem("Relatório de despesa enviado com sucesso!");
      setForm({ colaborador: "", valor: "", descricao: "", recibo: "" });
    } catch (err) {
      setErro(err?.response?.data?.msg || "Erro ao enviar relatório");
    }
  };

  return (
    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h5" className="mb-4 font-bold">Novo Relatório de Despesa</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            select
            label="Funcionário"
            name="colaborador"
            fullWidth
            value={form.colaborador}
            onChange={handleChange}
            required
          >
            <MenuItem value="">Selecione</MenuItem>
            {colaboradores.map((colab) => (
              <MenuItem key={colab._id} value={colab._id}>{colab.nome}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            name="valor"
            type="number"
            fullWidth
            value={form.valor}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descrição"
            name="descricao"
            fullWidth
            multiline
            minRows={2}
            value={form.descricao}
            onChange={handleChange}
            required
          />
          <TextField
            label="Recibo (nome do arquivo)"
            name="recibo"
            fullWidth
            value={form.recibo}
            onChange={handleChange}
            required
            helperText="Simule um nome de arquivo, exemplo: recibo001.jpg"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enviar
          </Button>
        </form>
        {mensagem && <Alert severity="success" className="mt-4">{mensagem}</Alert>}
        {erro && <Alert severity="error" className="mt-4">{erro}</Alert>}
      </Box>
    </Container>
  );
}
