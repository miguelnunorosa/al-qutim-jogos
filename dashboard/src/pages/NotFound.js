import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import GeometricMark from '../theme/GeometricMark';

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                px: 3,
                textAlign: 'center',
            }}
        >
            <GeometricMark size={56} color="#C9973E" opacity={0.7} />
            <Typography variant="h3" sx={{ mt: 3, fontSize: { xs: 32, md: 40 } }}>
                404
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
                Esta página não existe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 340 }}>
                O endereço que tentaste abrir não corresponde a nada na dashboard do Al-Qutim.
            </Typography>
            <Button component={RouterLink} to="/" variant="contained" color="secondary" sx={{ mt: 4 }}>
                Voltar ao início
            </Button>
        </Box>
    );
}