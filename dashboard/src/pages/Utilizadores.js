import React from 'react';
import { Box, Typography } from '@mui/material';
import EmptyState from '../components/EmptyState';

export default function Utilizadores() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
                    Utilizadores
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Gestão de contas e permissões.
                </Typography>
            </Box>
            <EmptyState
                title="Ainda sem lista de utilizadores"
                description="Assim que a autenticação estiver ligada, os utilizadores registados vão aparecer aqui."
            />
        </Box>
    );
}