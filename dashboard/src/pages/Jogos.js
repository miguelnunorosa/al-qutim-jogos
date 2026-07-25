import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Box, Grid, Card, Typography, Chip, Stack, CircularProgress, Alert } from '@mui/material';
import { db } from '../firebase';
import GeometricMark from '../theme/GeometricMark';
import EmptyState from '../components/EmptyState';
import EditJogoDialog from '../components/EditJogoDialog';

export default function Jogos() {
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJogo, setSelectedJogo] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'jogos'), orderBy('ordem'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setJogos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            },
            (err) => {
                console.error('Erro ao ler a coleção "jogos":', err);
                setError('Não foi possível carregar os jogos do Firestore.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

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

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={28} sx={{ color: 'secondary.main' }} />
                </Box>
            )}

            {!loading && error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && jogos.length === 0 && (
                <EmptyState
                    title="Ainda sem jogos na coleção"
                    description='Corre o script "scripts/seedJogos.js" para popular a coleção "jogos" no Firestore.'
                />
            )}

            {!loading && !error && jogos.length > 0 && (
                <Grid container spacing={2.5}>
                    {jogos.map((jogo) => {
                        const texto = jogo.traducoes?.pt ?? {};
                        return (
                            <Grid item xs={12} sm={6} lg={4} key={jogo.id}>
                                <Card
                                    onClick={() => setSelectedJogo(jogo)}
                                    sx={{
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(19,27,51,0.08)',
                                        },
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <GeometricMark size={32} color="#C9973E" />
                                        <Chip
                                            label={jogo.ativo ? 'Ativo' : 'Inativo'}
                                            size="small"
                                            sx={{
                                                bgcolor: jogo.ativo ? 'rgba(47,184,172,0.14)' : 'rgba(19,27,51,0.06)',
                                                color: jogo.ativo ? '#1F8177' : 'text.secondary',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </Stack>
                                    <Box>
                                        <Typography variant="h6">{texto.nome ?? jogo.slug}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {texto.tipo ?? '—'}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            <EditJogoDialog
                jogo={selectedJogo}
                open={Boolean(selectedJogo)}
                onClose={() => setSelectedJogo(null)}
            />
        </Box>
    );
}