import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';

import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Jogos from './pages/Jogos';
import Utilizadores from './pages/Utilizadores';
import Definicoes from './pages/Definicoes';

// TODO: quando o Login estiver ligado ao Firebase Auth, envolver as rotas
// de /dashboard/* num <RequireAuth> que redireciona para "/" se não houver
// utilizador autenticado.

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="jogos" element={<Jogos />} />
                        <Route path="utilizadores" element={<Utilizadores />} />
                        <Route path="definicoes" element={<Definicoes />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;