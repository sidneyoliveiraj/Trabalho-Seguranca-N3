import { useState } from "react";
import api from "../utils/api";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");
    setSucesso(false);
    try {
      const resposta = await api.post("auth/login", { email, senha });
      setMensagem("Login realizado com sucesso!");
      setSucesso(true);
      localStorage.setItem("token", resposta.data.token);
      localStorage.setItem("cargo", resposta.data.usuario.cargo);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch (error) {
      setMensagem(error?.response?.data?.msg || "Erro ao fazer login");
      setSucesso(false);
    }
  };

  return (
    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full">
        <Typography variant="h4" align="center" className="mb-6 font-bold">Login</Typography>
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField label="E-mail" variant="outlined" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" variant="outlined" fullWidth required value={senha} onChange={(e) => setSenha(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth>Entrar</Button>
        </form>
        {mensagem && (
          <Alert severity={sucesso ? "success" : "error"} className="mt-4">
            {mensagem}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
