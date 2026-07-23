import React from 'react';

/**
 * Motivo geométrico da identidade do projeto: fusão dos quadrados
 * concêntricos do Moinho com as diagonais do Alquerque.
 * Usado como assinatura visual discreta (cabeçalho da sidebar, cards vazios).
 */
export default function GeometricMark({ size = 40, color = '#C9973E', opacity = 1 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity }}
        >
            <rect x="1" y="1" width="38" height="38" rx="10" stroke={color} strokeWidth="1.4" />
            <rect x="9" y="9" width="22" height="22" rx="5" stroke={color} strokeWidth="1.4" />
            <rect x="16" y="16" width="8" height="8" rx="2" fill={color} />
            <path d="M1 1L15 15" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
            <path d="M39 1L25 15" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
            <path d="M1 39L15 25" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
            <path d="M39 39L25 25" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        </svg>
    );
}