import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Alert
} from "@mui/material";

export default function SignExpense() {
  const [reportes, setReportes] = useState([]);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarAprovados();
  }, []);

  const listarAprovados = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/api/reportes");
      
      setReportes(resp.data.filter(r => r.status === "aprovado" && !r.assinaturaDigital));
    } catch {
      setErro("Erro ao buscar relatórios.");
    }
  };

  const assinar = async (id) => {
    setMsg(""); setErro("");
    try {
      
      await axios.post("http://localhost:5000/api/assinaturas", { reporteId: id });
      setMsg("Relatório assinado digitalmente!");
      listarAprovados();
    } catch {
      setErro("Erro ao assinar relatório.");
    }
  };

  return (
    <Container maxWidth="lg" className="py-10">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h5" align="center" className="mb-6 font-bold">
          Assinatura Digital de Relatórios
        </Typography>
        {msg && <Alert severity="success" className="mb-4">{msg}</Alert>}
        {erro && <Alert severity="error" className="mb-4">{erro}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Funcionário</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Recibo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportes.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.colaborador?.nome || r.colaborador}</TableCell>
                  <TableCell>{Number(r.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{r.descricao}</TableCell>
                  <TableCell>{r.recibo}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => assinar(r._id)}>
                      Assinar Digitalmente
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reportes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum relatório aprovado pendente de assinatura.
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
