import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Container, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Alert, MenuItem, Select
} from "@mui/material";

export default function PendingExpenses() {
  const [reportes, setReportes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarReportes();
  }, []);

  const listarReportes = async () => {
    try {
      const resp = await api.get("reportes");
      setReportes(resp.data.filter(r => !r.status || r.status === "pendente"));
    } catch {
      setErro("Erro ao buscar relatórios.");
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`reportes/${id}/status`, { status: novoStatus });
      setMensagem(`Relatório ${novoStatus === "aprovado" ? "aprovado" : "rejeitado"}!`);
      listarReportes();
    } catch {
      setErro("Erro ao atualizar status.");
    }
  };

  return (
    <Container maxWidth="lg" className="py-10">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h5" align="center" className="mb-6 font-bold">Relatórios Pendentes</Typography>
        {mensagem && <Alert severity="success" className="mb-4">{mensagem}</Alert>}
        {erro && <Alert severity="error" className="mb-4">{erro}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Funcionário</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Recibo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.colaborador?.nome || r.colaborador}</TableCell>
                  <TableCell>{Number(r.valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</TableCell>
                  <TableCell>{r.descricao}</TableCell>
                  <TableCell>{r.recibo}</TableCell>
                  <TableCell>
                    <Select
                      value={r.status || "pendente"}
                      disabled
                    >
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="aprovado">Aprovado</MenuItem>
                      <MenuItem value="rejeitado">Rejeitado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      className="mr-2"
                      onClick={() => atualizarStatus(r._id, "aprovado")}
                    >Aprovar</Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => atualizarStatus(r._id, "rejeitado")}
                    >Rejeitar</Button>
                  </TableCell>
                </TableRow>
              ))}
              {reportes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum relatório pendente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
