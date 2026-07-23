import React from 'react';
import { Box, Typography } from '@mui/material';
import EmptyState from '../components/EmptyState';

export default function Definicoes() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
                    Definições
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Preferências da conta e da aplicação.
                </Typography>
            </Box>
            <EmptyState
                title="Ainda sem definições configuráveis"
                description="Esta secção vai reunir as preferências da dashboard à medida que forem definidas."
            />
        </Box>
    );
}