import React, { useEffect, useState } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
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
} from '@mui/material';
import { db } from '../firebase';

const emptyForm = { nome: '', email: '', role: 'jogador', ativo: true };

export const ROLES = {
    admin: 'Administrador',
    gestor_conteudo: 'Gestor de Conteúdo',
    jogador: 'Jogador',
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
        setSaving(true);
        setError(null);
        try {
            if (isEdit) {
                await updateDoc(doc(db, 'utilizadores', utilizador.id), {
                    nome: form.nome,
                    email: form.email,
                    role: form.role,
                    ativo: form.ativo,
                    dataRegisto: utilizador.dataRegisto,
                });
            } else {
                await addDoc(collection(db, 'utilizadores'), {
                    nome: form.nome,
                    email: form.email,
                    role: form.role,
                    ativo: form.ativo,
                    dataRegisto: serverTimestamp(),
                });
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