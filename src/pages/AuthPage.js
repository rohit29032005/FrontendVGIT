import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import Login from '/components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                {isLogin ? (
                    <Login onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                    <Register onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </Box>
        </Container>
    );
};

export default AuthPage;
