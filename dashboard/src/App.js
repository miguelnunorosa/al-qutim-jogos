import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Jogos from './pages/Jogos';
import Utilizadores from './pages/Utilizadores';
import Definicoes from './pages/Definicoes';
import NotFound from './pages/NotFound';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route element={<RequireAuth />}>
                            <Route path="/dashboard" element={<DashboardLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="jogos" element={<Jogos />} />
                                <Route path="utilizadores" element={<Utilizadores />} />
                                <Route path="definicoes" element={<Definicoes />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;