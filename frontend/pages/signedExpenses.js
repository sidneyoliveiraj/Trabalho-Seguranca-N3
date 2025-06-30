import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";
import { useRouter } from "next/router";

export default function SignedExpenses() {
  const [assinaturas, setAssinaturas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:5000/api/assinaturas")
      .then(res => setAssinaturas(res.data));
  }, []);

  return (
    <Container maxWidth="lg" className="py-10">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h5" align="center" className="mb-6 font-bold">
          Relatórios Assinados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Funcionário</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Recibo</TableCell>
                <TableCell>Status Assinatura</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assinaturas.map(a => (
                <TableRow key={a._id}>
                  <TableCell>
                    {a.reporte?.colaborador?.nome || a.reporte?.colaborador}
                  </TableCell>
                  <TableCell>{a.reporte?.descricao}</TableCell>
                  <TableCell>{Number(a.reporte?.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>{a.reporte?.recibo}</TableCell>
                  <TableCell>Assinado</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => router.push(`/verifySignature?id=${a._id}`)}
                    >
                      VERIFICAR ASSINATURA
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {assinaturas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum relatório assinado.
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
