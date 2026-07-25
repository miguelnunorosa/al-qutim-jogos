import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import { auth } from '../firebase';

export default function ForgotPasswordDialog({ open, onClose }) {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        // Reset do estado interno ao fechar, mas só depois da animação de saída.
        setTimeout(() => {
            setEmail('');
            setEnviado(false);
            setError('');
        }, 200);
        onClose();
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Introduz o teu email.');
            return;
        }
        setSending(true);
        setError('');
        try {
            await sendPasswordResetEmail(auth, email.trim().toLowerCase());
        } catch (err) {
            // Não revelamos se o email existe ou não, por segurança — só
            // tratamos erros que não têm a ver com a existência da conta.
            if (err.code !== 'auth/user-not-found') {
                console.error('Erro ao enviar email de reposição:', err);
            }
        } finally {
            setSending(false);
            setEnviado(true);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Repor palavra-passe</DialogTitle>
            <DialogContent>
                {enviado ? (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Se existir uma conta com esse email, foi enviado um link para repores a
                        palavra-passe. Verifica a caixa de entrada (e o spam).
                    </Alert>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Indica o email da tua conta — enviamos-te um link para escolheres uma nova
                            palavra-passe.
                        </Typography>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose}>{enviado ? 'Fechar' : 'Cancelar'}</Button>
                {!enviado && (
                    <Button onClick={handleSend} variant="contained" color="secondary" disabled={sending}>
                        {sending ? 'A enviar…' : 'Enviar link'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}