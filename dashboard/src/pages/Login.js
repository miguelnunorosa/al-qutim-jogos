import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Link } from '@mui/material';
import '../styles/login.css'; // Importe o arquivo CSS para estilização

// Importe o logo do clube
import Logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Para "Memorizar login"
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulando validação de login
    if (email === '' || senha === '') {
      setError('Por favor, preencha todos os campos.');
    } else {
      setError('');
      console.log('Login bem-sucedido', email, senha, rememberMe);
      // Aqui você pode integrar com a API de login
    }
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);  // Alterna o estado do checkbox "Memorizar login"
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Logo do clube */}
        <div className="login-logo">
          <img src={Logo} alt="Logo do Clube" />
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Senha"
            variant="outlined"
            type="password"
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            margin="normal"
          />

          {/* Mensagem de erro */}
          {error && <div className="error-message">{error}</div>}

          {/* Checkbox "Memorizar login" e Link "Recuperar senha" */}
          <div className="links-container">
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={handleRememberMe} />}
              label="Memorizar login"
            />
            <Link href="#" variant="body2">Recuperar senha</Link>
          </div>

          {/* Botão de login */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
