import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Typography, Container, Box, Grid } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, []);
  return (
    <Container maxWidth="md" className="flex flex-col items-center justify-center min-h-screen">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full text-center">
        <Typography variant="h4" className="mb-8 font-bold">Painel de Controle</Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/employees")} fullWidth variant="contained" color="primary">
              Funcionários
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/submitExpense")} fullWidth variant="contained" color="primary">
              Novo Relatório de Despesa
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/pendingExpenses")} fullWidth variant="contained" color="primary">
              Relatórios Pendentes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/signExpense")} fullWidth variant="contained" color="primary">
              Assinar Relatório
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/signedExpenses")} fullWidth variant="contained" color="primary">
              Relatórios Assinados
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button onClick={() => router.push("/verifySignature")} fullWidth variant="contained" color="primary">
              Verificar Assinatura
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
