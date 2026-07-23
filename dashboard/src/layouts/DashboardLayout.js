import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Avatar,
    Divider,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../assets/logo.png';
import GeometricMark from '../theme/GeometricMark';

const DRAWER_WIDTH = 264;

const NAV_ITEMS = [
    { label: 'Início', to: '/dashboard', icon: SpaceDashboardOutlinedIcon },
    { label: 'Jogos', to: '/dashboard/jogos', icon: CasinoOutlinedIcon },
    { label: 'Utilizadores', to: '/dashboard/utilizadores', icon: GroupOutlinedIcon },
    { label: 'Definições', to: '/dashboard/definicoes', icon: SettingsOutlinedIcon },
];

function SidebarContent() {
    const location = useLocation();

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 3.5 }}>
                <Box
                    component="img"
                    src={logo}
                    alt="Al-Qutim"
                    sx={{ width: 36, height: 36, borderRadius: '10px' }}
                />
                <Box>
                    <Typography sx={{ fontFamily: 'Spectral, serif', fontWeight: 600, lineHeight: 1.1, color: '#F3EFE4' }}>
                        Al-Qutim
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(243,239,228,0.55)', letterSpacing: 0.6 }}>
                        JOGOS DO GHARB
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(243,239,228,0.08)', mx: 3, mb: 1 }} />

            <List sx={{ px: 1, flexGrow: 1 }}>
                {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
                    const selected =
                        to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to);
                    return (
                        <ListItemButton key={to} component={NavLink} to={to} selected={selected}>
                            <ListItemIcon sx={{ minWidth: 38, color: selected ? '#E4C588' : 'rgba(243,239,228,0.65)' }}>
                                <Icon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{
                                    fontSize: 14.5,
                                    fontWeight: selected ? 600 : 500,
                                    color: selected ? '#F3EFE4' : 'rgba(243,239,228,0.75)',
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            <Box sx={{ px: 3, pb: 3, opacity: 0.35 }}>
                <GeometricMark size={28} color="#F3EFE4" />
            </Box>
        </Box>
    );
}

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width:900px)');

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    {!isDesktop && (
                        <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 600 }}>
                        AQ
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant={isDesktop ? 'permanent' : 'temporary'}
                    open={isDesktop ? true : mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                >
                    <SidebarContent />
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 3, md: 4.5 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}