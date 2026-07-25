import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({ user: null, perfil: null, loading: true });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [perfil, setPerfil] = useState(null); // documento correspondente em "utilizadores"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Liga a conta de autenticação ao registo em "utilizadores" pelo email
                    // (os registos atuais não têm o uid, foram criados à mão pela dashboard).
                    const q = query(collection(db, 'utilizadores'), where('email', '==', firebaseUser.email), limit(1));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                        const docSnap = snapshot.docs[0];
                        setPerfil({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        console.warn('Sessão iniciada mas sem registo correspondente em "utilizadores".');
                        setPerfil(null);
                    }
                } catch (err) {
                    console.error('Erro ao carregar o perfil do utilizador:', err);
                    setPerfil(null);
                }
            } else {
                setPerfil(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, perfil, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}