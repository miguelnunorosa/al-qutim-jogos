import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import {
    Box,
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    CircularProgress,
    Alert,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { db } from '../firebase';
import EmptyState from '../components/EmptyState';
import EditUtilizadorDialog, { ROLES } from '../components/EditUtilizadorDialog';

const ROLE_COLORS = {
    admin: { bg: 'rgba(201,151,62,0.16)', fg: '#9C6B2A' },
    gestor_conteudo: { bg: 'rgba(47,184,172,0.14)', fg: '#1F8177' },
    jogador: { bg: 'rgba(19,27,51,0.06)', fg: 'text.secondary' },
};

export default function Utilizadores() {
    const [utilizadores, setUtilizadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selected, setSelected] = useState(null); // null = modo criação

    useEffect(() => {
        const q = query(collection(db, 'utilizadores'), orderBy('dataRegisto', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                setUtilizadores(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            },
            (err) => {
                console.error('Erro ao ler a coleção "utilizadores":', err);
                setError('Não foi possível carregar os utilizadores do Firestore.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const openCreate = () => {
        setSelected(null);
        setDialogOpen(true);
    };

    const openEdit = (utilizador) => {
        setSelected(utilizador);
        setDialogOpen(true);
    };

    const formatData = (timestamp) => {
        if (!timestamp?.toDate) return '—';
        return timestamp.toDate().toLocaleDateString('pt-PT');
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
                        Utilizadores
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Gestão de contas e permissões.
                    </Typography>
                </Box>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
                    Adicionar
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={28} sx={{ color: 'secondary.main' }} />
                </Box>
            )}

            {!loading && error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && utilizadores.length === 0 && (
                <EmptyState
                    title="Ainda sem utilizadores"
                    description='Usa o botão "Adicionar" acima para criar o primeiro registo.'
                />
            )}

            {!loading && !error && utilizadores.length > 0 && (
                <Paper sx={{ overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Função</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Registo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {utilizadores.map((u) => (
                                <TableRow
                                    key={u.id}
                                    hover
                                    onClick={() => openEdit(u)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: 600 }}>{u.nome}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ROLES[u.role] ?? u.role}
                                            size="small"
                                            sx={{
                                                bgcolor: (ROLE_COLORS[u.role] ?? ROLE_COLORS.jogador).bg,
                                                color: (ROLE_COLORS[u.role] ?? ROLE_COLORS.jogador).fg,
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.ativo ? 'Ativo' : 'Inativo'}
                                            size="small"
                                            sx={{
                                                bgcolor: u.ativo ? 'rgba(47,184,172,0.14)' : 'rgba(19,27,51,0.06)',
                                                color: u.ativo ? '#1F8177' : 'text.secondary',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{formatData(u.dataRegisto)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <EditUtilizadorDialog
                utilizador={selected}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </Box>
    );
}