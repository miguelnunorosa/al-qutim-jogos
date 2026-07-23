import React from 'react';
import { Box, Grid, Card, Typography, Chip, Stack } from '@mui/material';
import GeometricMark from '../theme/GeometricMark';

const GAMES = [
    { name: 'Moinho', tipo: 'Alinhamento e captura' },
    { name: 'Alquerque', tipo: 'Estratégia militar' },
    { name: 'Tapatan', tipo: 'Jogo do Galo' },
    { name: 'Tábula', tipo: 'Ancestral do gamão' },
    { name: 'Mancala III', tipo: 'Semeadura e contagem' },
    { name: 'Soldado', tipo: 'Percurso e estratégia' },
];

export default function Jogos() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
                    Jogos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    As seis tipologias de jogos identificadas nas escavações de Alcoutim.
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                {GAMES.map((game) => (
                    <Grid item xs={12} sm={6} lg={4} key={game.name}>
                        <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <GeometricMark size={32} color="#C9973E" />
                                <Chip label="Por configurar" size="small" sx={{ bgcolor: 'rgba(19,27,51,0.06)' }} />
                            </Stack>
                            <Box>
                                <Typography variant="h6">{game.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {game.tipo}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}