import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token'),
        loading: true,
        error: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await authAPI.getProfile();
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: localStorage.getItem('token'),
                },
            });
        } catch (error) {
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
        }
    };

    const login = async (credentials) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authAPI.login(credentials);
            
            localStorage.setItem('token', response.data.token);
            
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: response.data.token,
                },
            });
            
            return { success: true };
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await authAPI.register(userData);
            
            localStorage.setItem('token', response.data.token);
            
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: response.data.token,
                },
            });
            
            return { success: true };
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
