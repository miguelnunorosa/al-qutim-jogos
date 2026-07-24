import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
    Alert,
    Typography,
} from '@mui/material';
import { db } from '../firebase';

const LANGUAGES = [
    { key: 'pt', label: 'Português' },
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
];

const emptyTexto = { nome: '', tipo: '', regras: '' };

function buildInitialForm(jogo) {
    return {
        ativo: jogo?.ativo ?? true,
        ordem: jogo?.ordem ?? 0,
        imagemUrl: jogo?.imagemUrl ?? '',
        traducoes: {
            pt: { ...emptyTexto, ...(jogo?.traducoes?.pt ?? {}) },
            en: { ...emptyTexto, ...(jogo?.traducoes?.en ?? {}) },
            es: { ...emptyTexto, ...(jogo?.traducoes?.es ?? {}) },
        },
    };
}

export default function EditJogoDialog({ jogo, open, onClose, onSaved }) {
    const [tab, setTab] = useState('pt');
    const [form, setForm] = useState(() => buildInitialForm(jogo));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Repõe o formulário sempre que se abre um jogo diferente
    useEffect(() => {
        if (jogo) {
            setForm(buildInitialForm(jogo));
            setTab('pt');
            setError(null);
        }
    }, [jogo]);

    if (!jogo) return null;

    const handleFieldChange = (lang, field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            traducoes: {
                ...prev.traducoes,
                [lang]: { ...prev.traducoes[lang], [field]: value },
            },
        }));
    };

    const handleCommonChange = (field) => (e) => {
        const value = field === 'ativo' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await updateDoc(doc(db, 'jogos', jogo.id), {
                ativo: form.ativo,
                ordem: Number(form.ordem) || 0,
                imagemUrl: form.imagemUrl,
                traducoes: form.traducoes,
            });
            onSaved?.();
            onClose();
        } catch (err) {
            console.error('Erro ao guardar o jogo:', err);
            setError('Não foi possível guardar as alterações. Tenta novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Editar jogo
                <Typography variant="body2" color="text.secondary">
                    {jogo.slug}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    {LANGUAGES.map(({ key, label }) => (
                        <Tab key={key} value={key} label={label} />
                    ))}
                </Tabs>

                {LANGUAGES.map(({ key }) =>
                    key === tab ? (
                        <Stack key={key} spacing={2} sx={{ mb: 3 }}>
                            <TextField
                                label="Nome"
                                value={form.traducoes[key].nome}
                                onChange={handleFieldChange(key, 'nome')}
                                fullWidth
                            />
                            <TextField
                                label="Tipo"
                                value={form.traducoes[key].tipo}
                                onChange={handleFieldChange(key, 'tipo')}
                                fullWidth
                            />
                            <TextField
                                label="Regras"
                                value={form.traducoes[key].regras}
                                onChange={handleFieldChange(key, 'regras')}
                                fullWidth
                                multiline
                                minRows={4}
                            />
                        </Stack>
                    ) : null
                )}

                <Typography variant="overline" color="text.secondary">
                    Campos comuns (não traduzidos)
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Ordem"
                        type="number"
                        value={form.ordem}
                        onChange={handleCommonChange('ordem')}
                        sx={{ maxWidth: 160 }}
                    />
                    <TextField
                        label="URL da imagem"
                        value={form.imagemUrl}
                        onChange={handleCommonChange('imagemUrl')}
                        fullWidth
                    />
                    <FormControlLabel
                        control={<Switch checked={form.ativo} onChange={handleCommonChange('ativo')} />}
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