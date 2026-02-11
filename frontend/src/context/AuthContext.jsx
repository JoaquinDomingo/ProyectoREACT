import React, { createContext, useState, useEffect, useContext } from 'react';
import api from './api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            console.log("Login response:", response.data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login error", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error occurred during login'
            };
        }
    };

    const register = async (username, password, role) => {
        try {
            await api.post('/auth/register', { username, password, role });
            return { success: true };
        } catch (error) {
            console.error("Registration error", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error occurred during registration'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
