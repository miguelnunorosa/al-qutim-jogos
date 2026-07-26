import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, limit, onSnapshot as onFirestoreSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({ user: null, perfil: null, loading: true });

// Roles que têm acesso à dashboard — partilhado entre RequireAuth e Login.
export const ROLES_COM_ACESSO = ['admin', 'gestor_conteudo'];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [perfil, setPerfil] = useState(null); // documento correspondente em "utilizadores"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubPerfil = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);

            // Cancela o listener do perfil anterior (se existir) antes de criar outro.
            if (unsubPerfil) {
                unsubPerfil();
                unsubPerfil = null;
            }

            if (firebaseUser) {
                // Liga a conta de autenticação ao registo em "utilizadores" pelo email
                // (os registos atuais não têm o uid, foram criados à mão pela dashboard).
                // Usa onSnapshot (não getDocs) para o perfil ficar "vivo" — ex: mudar o
                // próprio nome nas Definições reflete-se logo no topo da dashboard.
                const emailNormalizado = firebaseUser.email.trim().toLowerCase();
                const q = query(collection(db, 'utilizadores'), where('email', '==', emailNormalizado), limit(1));

                unsubPerfil = onFirestoreSnapshot(
                    q,
                    (snapshot) => {
                        if (!snapshot.empty) {
                            const docSnap = snapshot.docs[0];
                            setPerfil({ id: docSnap.id, ...docSnap.data() });
                        } else {
                            console.warn('Sessão iniciada mas sem registo correspondente em "utilizadores".');
                            setPerfil(null);
                        }
                        setLoading(false);
                    },
                    (err) => {
                        console.error('Erro ao carregar o perfil do utilizador:', err);
                        setPerfil(null);
                        setLoading(false);
                    }
                );
            } else {
                setPerfil(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubPerfil) unsubPerfil();
        };
    }, []);

    return <AuthContext.Provider value={{ user, perfil, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}