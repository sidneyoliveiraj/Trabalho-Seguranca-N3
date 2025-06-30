import { useEffect, useState } from "react";
import api from "../utils/api";
import { useRouter } from "next/router";
import { Container, Box, Typography, Button, Alert } from "@mui/material";

export default function VerifySignature() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [assinatura, setAssinatura] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (id) setAssinatura(id);
  }, [router.query]);

  const verificar = async () => {
    setMsg(""); setErro("");
    try {
      const resp = await api.post("assinaturas/verificar", { assinaturaId: assinatura });
      setMsg(resp.data.msg);
    } catch (err) {
      setErro(err.response?.data?.msg || "Erro ao verificar assinatura");
    }
  };

  if (!assinatura) return <Container><p>Carregando...</p></Container>;

  return (
    <Container maxWidth="sm">
      <Box className="shadow-xl p-8 rounded-xl bg-white w-full mt-8">
        <Typography variant="h5" align="center" className="mb-6 font-bold">
          Verificar Assinatura Digital
        </Typography>
        {msg && <Alert severity="success" className="mb-4">{msg}</Alert>}
        {erro && <Alert severity="error" className="mb-4">{erro}</Alert>}
        <Button
          variant="contained"
          color="primary"
          onClick={verificar}
          fullWidth
        >
          Verificar Autenticidade
        </Button>
      </Box>
    </Container>
  );
}
