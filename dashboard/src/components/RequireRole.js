import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Restringe uma sub-rota de /dashboard/* a roles específicos (ex: só
// "admin" pode entrar em /dashboard/utilizadores). Diferente do RequireAuth
// — este assume que já se passou nesse (sessão válida, role com acesso à
// dashboard em geral) e só afina o acesso a UMA página em concreto.
export default function RequireRole({ roles }) {
    const { perfil } = useAuth();

    if (!perfil || !roles.includes(perfil.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}