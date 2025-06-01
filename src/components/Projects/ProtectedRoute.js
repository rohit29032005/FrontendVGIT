import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to auth');
        return <Navigate to="/auth" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        console.log('❌ Admin access required, user role:', user?.role);
        return (
            <Box p={3} textAlign="center">
                <Typography variant="h4" color="error" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You don't have permission to access this page.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Current role: {user?.role || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Required role: admin
                </Typography>
            </Box>
        );
    }

    console.log('✅ Access granted for user:', user?.email, 'Role:', user?.role);
    return children;
};

export default ProtectedRoute;
