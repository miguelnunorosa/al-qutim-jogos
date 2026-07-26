import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Jogos from './pages/Jogos';
import Utilizadores from './pages/Utilizadores';
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

                                <Route element={<RequireRole roles={['admin']} />}>
                                    <Route path="utilizadores" element={<Utilizadores />} />
                                </Route>
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