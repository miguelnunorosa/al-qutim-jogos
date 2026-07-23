import React from 'react';
import { Box, Grid, Card, Typography, Stack, LinearProgress } from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import StatCard from '../components/StatCard';

const GAMES = [
    { name: 'Moinho', tipo: 'Alinhamento e captura', percentagem: 82 },
    { name: 'Alquerque', tipo: 'Estratégia militar', percentagem: 67 },
    { name: 'Tapatan', tipo: 'Jogo do Galo', percentagem: 54 },
    { name: 'Tábula', tipo: 'Ancestral do gamão', percentagem: 41 },
    { name: 'Mancala III', tipo: 'Semeadura e contagem', percentagem: 36 },
    { name: 'Soldado', tipo: 'Percurso e estratégia', percentagem: 22 },
];

export default function Dashboard() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
                    Bem-vindo de volta
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Resumo da atividade do Al-Qutim — Jogos do Gharb.
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard label="Utilizadores ativos" value="1 284" delta="+8,2% este mês" accent="#C9973E" icon={PeopleAltOutlinedIcon} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard label="Partidas jogadas" value="9 431" delta="+142 hoje" accent="#2FB8AC" icon={SportsEsportsOutlinedIcon} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard label="Jogo mais jogado" value="Moinho" accent="#9C6B2A" icon={EmojiEventsOutlinedIcon} />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <StatCard label="Retenção a 7 dias" value="61%" delta="+3,1 p.p." accent="#2C4570" icon={TrendingUpOutlinedIcon} />
                </Grid>
            </Grid>

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} lg={7}>
                    <Card sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            Popularidade por jogo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Percentagem de partidas do total, últimos 30 dias.
                        </Typography>
                        <Stack spacing={2.5}>
                            {GAMES.map((game) => (
                                <Box key={game.name}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {game.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {game.tipo}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, alignSelf: 'center' }}>
                                            {game.percentagem}%
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={game.percentagem}
                                        sx={{
                                            height: 8,
                                            borderRadius: 999,
                                            bgcolor: 'rgba(19,27,51,0.06)',
                                            '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: 'secondary.main' },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Card sx={{ p: 3, height: '100%', bgcolor: 'primary.main', color: '#F3EFE4' }}>
                        <Typography variant="overline" sx={{ color: 'rgba(243,239,228,0.6)' }}>
                            Contexto histórico
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, mb: 1.5, color: '#F3EFE4' }}>
                            Castelo Velho de Alcoutim
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(243,239,228,0.75)', lineHeight: 1.7 }}>
                            Os jogos recriados nesta aplicação foram exumados durante escavações numa fortificação
                            islâmica ocupada entre os séculos VIII e XI, gravados por incisão em lajes de xisto pelos
                            habitantes locais.
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}