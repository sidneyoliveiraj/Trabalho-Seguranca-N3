import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Button, Typography, Container, Box, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Alert
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Employees() {
  const [empregados, setEmpregados] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", cargo: "" });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => { listarEmpregados(); }, []);

  const listarEmpregados = async () => {
    try {
      const resposta = await api.get("empregados");
      setEmpregados(resposta.data);
    } catch (err) {
      setErro("Erro ao listar funcionários.");
    }
  };

  const abrirModal = (empregado = null) => {
    setEditing(empregado);
    if (empregado) setForm({ nome: empregado.nome, email: empregado.email, senha: "", cargo: empregado.cargo });
    else setForm({ nome: "", email: "", senha: "", cargo: "" });
    setOpen(true); setMensagem(""); setErro("");
  };

  const fecharModal = () => setOpen(false);

  const salvarEmpregado = async () => {
    setErro(""); setMensagem("");
    try {
      if (editing) {
        await api.put(`empregados/${editing._id}`, form);
        setMensagem("Funcionário atualizado com sucesso!");
      } else {
        await api.post("empregados", form);
        setMensagem("Funcionário cadastrado com sucesso!");
      }
      setOpen(false);
      listarEmpregados();
    } catch (err) {
      setErro(err?.response?.data?.msg || "Erro ao salvar funcionário.");
    }
  };

  const excluirEmpregado = async (id) => {
    if (confirm("Deseja realmente remover este funcionário?")) {
      try {
        await api.delete(`empregados/${id}`);
        listarEmpregados();
      } catch {
        setErro("Erro ao remover funcionário.");
      }
    }
  };

  return (
    <Container maxWidth="md" className="py-10">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h4" align="center" className="mb-6 font-bold">Funcionários</Typography>
        <Button variant="contained" color="primary" onClick={() => abrirModal()} className="mb-4">
          Novo Funcionário
        </Button>
        {mensagem && <Alert severity="success" className="mb-4">{mensagem}</Alert>}
        {erro && <Alert severity="error" className="mb-4">{erro}</Alert>}
        <TableContainer component={Paper} className="mb-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empregados.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.nome}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.cargo}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => abrirModal(emp)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => excluirEmpregado(emp._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={fecharModal}>
        <DialogTitle>{editing ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
        <DialogContent>
          <TextField label="Nome" fullWidth margin="dense" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <TextField label="E-mail" fullWidth margin="dense" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!!editing} />
          <TextField label="Senha" type="password" fullWidth margin="dense" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
          <TextField label="Cargo" fullWidth margin="dense" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button onClick={salvarEmpregado} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
