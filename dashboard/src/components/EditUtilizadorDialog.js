import React, { useEffect, useState } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp, query, where, limit, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    Typography,
} from '@mui/material';
import { db, secondaryAuth } from '../firebase';

const emptyForm = { nome: '', email: '', role: 'jogador', ativo: true, password: '' };

export const ROLES = {
    admin: 'Administrador',
    gestor_conteudo: 'Gestor de Conteúdo',
    jogador: 'Jogador',
};

const ERROS_CRIACAO = {
    'auth/email-already-in-use': 'Já existe uma conta de login com este email.',
    'auth/invalid-email': 'Email inválido.',
    'auth/weak-password': 'A palavra-passe tem de ter pelo menos 6 caracteres.',
};

// utilizador === null -> modo criação. utilizador === {id, ...} -> modo edição.
export default function EditUtilizadorDialog({ utilizador, open, onClose }) {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const isEdit = Boolean(utilizador);

    useEffect(() => {
        if (open) {
            setForm(
                utilizador
                    ? {
                        nome: utilizador.nome ?? '',
                        email: utilizador.email ?? '',
                        role: utilizador.role ?? 'jogador',
                        ativo: utilizador.ativo ?? true,
                        password: '',
                    }
                    : emptyForm
            );
            setError(null);
        }
    }, [open, utilizador]);

    const handleChange = (field) => (e) => {
        const value = field === 'ativo' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!form.nome.trim() || !form.email.trim()) {
            setError('Preenche o nome e o email.');
            return;
        }
        if (!isEdit && form.password.length < 6) {
            setError('A palavra-passe inicial tem de ter pelo menos 6 caracteres.');
            return;
        }

        const emailNormalizado = form.email.trim().toLowerCase();
        setSaving(true);
        setError(null);

        try {
            // Impede dois utilizadores com o mesmo email — o login e o AuthContext
            // associam a conta ao perfil por email, e um duplicado tornaria essa
            // associação imprevisível.
            const q = query(collection(db, 'utilizadores'), where('email', '==', emailNormalizado), limit(1));
            const existentes = await getDocs(q);
            const duplicado = !existentes.empty && existentes.docs[0].id !== utilizador?.id;
            if (duplicado) {
                setError('Já existe um utilizador com este email.');
                setSaving(false);
                return;
            }

            if (isEdit) {
                const payload = {
                    nome: form.nome,
                    email: emailNormalizado,
                    role: form.role,
                    ativo: form.ativo,
                    dataRegisto: utilizador.dataRegisto,
                };
                if (utilizador.ultimoAcesso) payload.ultimoAcesso = utilizador.ultimoAcesso;
                await updateDoc(doc(db, 'utilizadores', utilizador.id), payload);
            } else {
                // 1) Cria a conta de login (Authentication) numa instância secundária,
                //    para não trocar a sessão do admin que está a criar o utilizador.
                try {
                    await createUserWithEmailAndPassword(secondaryAuth, emailNormalizado, form.password);
                } catch (authErr) {
                    setError(ERROS_CRIACAO[authErr.code] ?? 'Não foi possível criar a conta de login.');
                    setSaving(false);
                    return;
                } finally {
                    // Limpa a sessão da instância secundária — nunca deve ficar "logada".
                    await signOut(secondaryAuth).catch(() => {});
                }

                // 2) Cria o perfil no Firestore. Se isto falhar, a conta de login já
                //    ficou criada — fica registado no erro para tratar à mão.
                try {
                    await addDoc(collection(db, 'utilizadores'), {
                        nome: form.nome,
                        email: emailNormalizado,
                        role: form.role,
                        ativo: form.ativo,
                        dataRegisto: serverTimestamp(),
                        ultimoAcesso: null,
                    });
                } catch (firestoreErr) {
                    console.error('Conta de login criada, mas o perfil no Firestore falhou:', firestoreErr);
                    setError(
                        'A conta de login foi criada, mas não foi possível guardar o perfil. Contacta o suporte técnico.'
                    );
                    setSaving(false);
                    return;
                }
            }
            onClose();
        } catch (err) {
            console.error('Erro ao guardar o utilizador:', err);
            setError('Não foi possível guardar. Tenta novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Remover "${form.nome}"? Esta ação não pode ser desfeita.`)) return;
        setSaving(true);
        setError(null);
        try {
            await deleteDoc(doc(db, 'utilizadores', utilizador.id));
            onClose();
        } catch (err) {
            console.error('Erro ao remover o utilizador:', err);
            setError('Não foi possível remover. Tenta novamente.');
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>{isEdit ? 'Editar utilizador' : 'Adicionar utilizador'}</DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 0.5 }}>
                    <TextField label="Nome" value={form.nome} onChange={handleChange('nome')} fullWidth autoFocus />
                    <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth />

                    {!isEdit && (
                        <TextField
                            label="Palavra-passe inicial"
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                            helperText="Mínimo 6 caracteres. A pessoa pode alterá-la depois com o link de recuperação."
                            fullWidth
                        />
                    )}

                    <TextField label="Função" select value={form.role} onChange={handleChange('role')} fullWidth>
                        {Object.entries(ROLES).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={form.ativo} onChange={handleChange('ativo')} />}
                        label="Ativo"
                    />

                    {!isEdit && (form.role === 'admin' || form.role === 'gestor_conteudo') && (
                        <Typography variant="caption" color="text.secondary">
                            Lembra-te de correr <code>node scripts/syncClaims.js</code> depois de criar, para esta
                            função ganhar acesso real à dashboard.
                        </Typography>
                    )}
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                {isEdit && (
                    <Button onClick={handleDelete} color="error" disabled={saving} sx={{ mr: 'auto' }}>
                        Remover
                    </Button>
                )}
                <Button onClick={onClose} disabled={saving}>
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" color="secondary" disabled={saving}>
                    {saving ? 'A guardar…' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}