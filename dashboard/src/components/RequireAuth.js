import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth, ROLES_COM_ACESSO } from '../contexts/AuthContext';

export default function RequireAuth() {
    const { user, perfil, loading } = useAuth();
    const semAcesso = !loading && Boolean(user) && (!perfil || !ROLES_COM_ACESSO.includes(perfil.role));

    // Autenticado mas sem role com acesso à dashboard: termina a sessão
    // (não faz sentido ficar "meio autenticado" a olhar para o ecrã de login).
    useEffect(() => {
        if (semAcesso) {
            signOut(auth);
        }
    }, [semAcesso]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <CircularProgress sx={{ color: 'secondary.main' }} />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (semAcesso) {
        return <Navigate to="/" replace state={{ erro: 'Esta conta não tem acesso à dashboard.' }} />;
    }

    return <Outlet />;
}