import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            console.log('🔄 Checking auth status...');
            const response = await authAPI.getProfile();
            
            console.log('✅ Profile loaded:', response.data.user);
            setUser(response.data.user);
            setIsAuthenticated(true);
            
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        console.log('✅ Login successful:', userData);
        localStorage.setItem('token', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log('🔄 Logging out...');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        hasRole,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
