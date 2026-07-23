import React from 'react';
import { Box, Typography } from '@mui/material';
import GeometricMark from '../theme/GeometricMark';

export default function EmptyState({ title, description }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 10,
                px: 3,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 5,
            }}
        >
            <GeometricMark size={48} color="#C9973E" opacity={0.5} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 380 }}>
                {description}
            </Typography>
        </Box>
    );
}