import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Typography,
    Alert,
    Divider,
} from '@mui/material';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const ERROS_SENHA = {
    'auth/wrong-password': 'Palavra-passe atual incorreta.',
    'auth/invalid-credential': 'Palavra-passe atual incorreta.',
    'auth/weak-password': 'A nova palavra-passe tem de ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiadas tentativas. Tenta novamente mais tarde.',
};

export default function ProfileDialog({ open, onClose }) {
    const { perfil } = useAuth();

    const [nome, setNome] = useState('');
    const [savingNome, setSavingNome] = useState(false);
    const [nomeError, setNomeError] = useState(null);
    const [nomeSucesso, setNomeSucesso] = useState(false);

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [savingSenha, setSavingSenha] = useState(false);
    const [senhaError, setSenhaError] = useState(null);
    const [senhaSucesso, setSenhaSucesso] = useState(false);

    useEffect(() => {
        if (open) {
            setNome(perfil?.nome ?? '');
            setNomeError(null);
            setNomeSucesso(false);
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
            setSenhaError(null);
            setSenhaSucesso(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSaveNome = async () => {
        if (!nome.trim()) {
            setNomeError('O nome não pode ficar vazio.');
            return;
        }
        setSavingNome(true);
        setNomeError(null);
        setNomeSucesso(false);
        try {
            await updateDoc(doc(db, 'utilizadores', perfil.id), { nome: nome.trim() });
            setNomeSucesso(true);
        } catch (err) {
            console.error('Erro ao atualizar o nome:', err);
            setNomeError('Não foi possível guardar o nome. Tenta novamente.');
        } finally {
            setSavingNome(false);
        }
    };

    const handleChangePassword = async () => {
        setSenhaError(null);
        setSenhaSucesso(false);

        if (!senhaAtual || !novaSenha) {
            setSenhaError('Preenche a palavra-passe atual e a nova.');
            return;
        }
        if (novaSenha.length < 6) {
            setSenhaError('A nova palavra-passe tem de ter pelo menos 6 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setSenhaError('As palavras-passe não coincidem.');
            return;
        }

        setSavingSenha(true);
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            // Mudar a palavra-passe exige sessão "recente" — reautentica primeiro.
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, novaSenha);
            setSenhaSucesso(true);
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (err) {
            console.error('Erro ao mudar a palavra-passe:', err);
            setSenhaError(ERROS_SENHA[err.code] ?? 'Não foi possível mudar a palavra-passe.');
        } finally {
            setSavingSenha(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>As minhas definições</DialogTitle>

            <DialogContent dividers>
                <Typography variant="overline" color="text.secondary">
                    Perfil
                </Typography>
                <Stack spacing={2} sx={{ mt: 1, mb: 3 }}>
                    <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
                    <TextField
                        label="Email"
                        value={perfil?.email ?? ''}
                        fullWidth
                        disabled
                        helperText="O email não pode ser alterado aqui."
                    />
                    {nomeError && <Alert severity="error">{nomeError}</Alert>}
                    {nomeSucesso && <Alert severity="success">Nome atualizado.</Alert>}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleSaveNome}
                        disabled={savingNome}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {savingNome ? 'A guardar…' : 'Guardar nome'}
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="overline" color="text.secondary">
                    Palavra-passe
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Palavra-passe atual"
                        type="password"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Nova palavra-passe"
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        helperText="Mínimo 6 caracteres."
                        fullWidth
                    />
                    <TextField
                        label="Confirmar nova palavra-passe"
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        fullWidth
                    />
                    {senhaError && <Alert severity="error">{senhaError}</Alert>}
                    {senhaSucesso && <Alert severity="success">Palavra-passe alterada com sucesso.</Alert>}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleChangePassword}
                        disabled={savingSenha}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {savingSenha ? 'A alterar…' : 'Alterar palavra-passe'}
                    </Button>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}