import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { collection, query, where, limit, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { auth, db } from '../firebase';
import logo from '../assets/logo.png';
import GeometricMark from '../theme/GeometricMark';
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';
import { useAuth, ROLES_COM_ACESSO } from '../contexts/AuthContext';

const ERROS_FIREBASE = {
  'auth/invalid-email': 'Email inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/user-not-found': 'Não existe conta com este email.',
  'auth/wrong-password': 'Palavra-passe incorreta.',
  'auth/invalid-credential': 'Email ou palavra-passe incorretos.',
  'auth/too-many-requests': 'Demasiadas tentativas. Tenta novamente mais tarde.',
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, perfil, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(location.state?.erro ?? '');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Já há sessão válida (ex: veio de um bookmark, ou clicou "Voltar ao
  // início" na página 404) — salta o formulário e vai direto à dashboard.
  const temAcesso = user && perfil && ROLES_COM_ACESSO.includes(perfil.role);

  useEffect(() => {
    if (!authLoading && temAcesso) {
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, temAcesso, navigate]);

  // Atualiza o campo "ultimoAcesso" do registo correspondente em "utilizadores"
  // (não bloqueia o login se isto falhar — é só informativo para a dashboard).
  const atualizarUltimoAcesso = async (userEmail) => {
    try {
      const emailNormalizado = userEmail.trim().toLowerCase();
      const q = query(collection(db, 'utilizadores'), where('email', '==', emailNormalizado), limit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(doc(db, 'utilizadores', snapshot.docs[0].id), {
          ultimoAcesso: serverTimestamp(),
        });
      } else {
        console.warn(
            `Não existe nenhum registo em "utilizadores" com o email "${emailNormalizado}" — o último acesso não foi atualizado.`
        );
      }
    } catch (err) {
      console.error('Não foi possível atualizar o último acesso:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === '' || senha === '') {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, senha);
      await atualizarUltimoAcesso(credential.user.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(ERROS_FIREBASE[err.code] ?? 'Não foi possível iniciar sessão. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Enquanto verificamos se já há sessão, ou enquanto o redirect acima está
  // a acontecer, mostra um spinner em vez de deixar o formulário "piscar".
  if (authLoading || temAcesso) {
    return (
        <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
            }}
        >
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
    );
  }

  return (
      <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            px: 2,
          }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: { xs: 3, sm: 4.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3.5 }}>
            <Box component="img" src={logo} alt="Al-Qutim" sx={{ width: 48, height: 48, borderRadius: '12px', mb: 1.5 }} />
            <Typography variant="h5">Al-Qutim</Typography>
            <Typography variant="body2" color="text.secondary">
              Entra para gerir a plataforma
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                autoFocus
                sx={{ mb: 2 }}
            />
            <TextField
                label="Palavra-passe"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <FormControlLabel
                  control={
                    <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        size="small"
                    />
                  }
                  label={<Typography variant="body2">Lembrar-me</Typography>}
              />
              <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => setForgotOpen(true)}
                  sx={{ color: 'secondary.dark', fontWeight: 600 }}
              >
                Esqueceu-se da palavra-passe?
              </Link>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
            )}

            <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading} sx={{ py: 1.2 }}>
              {loading ? 'A entrar…' : 'Entrar'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3.5, opacity: 0.4 }}>
            <GeometricMark size={26} color="#131B33" />
          </Box>
        </Card>

        <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
      </Box>
  );
}