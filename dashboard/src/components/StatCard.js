import React from 'react';
import { Card, Box, Typography } from '@mui/material';

export default function StatCard({ label, value, delta, accent = '#C9973E', icon: Icon }) {
    return (
        <Card sx={{ p: 2.75, display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="overline" color="text.secondary">
                    {label}
                </Typography>
                {Icon && (
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${accent}1F`,
                            color: accent,
                        }}
                    >
                        <Icon fontSize="small" />
                    </Box>
                )}
            </Box>
            <Typography variant="h4" sx={{ fontSize: 30 }}>
                {value}
            </Typography>
            {delta && (
                <Typography variant="body2" sx={{ color: delta.startsWith('-') ? '#B5453B' : '#1F8177', fontWeight: 600 }}>
                    {delta}
                </Typography>
            )}
        </Card>
    );
}