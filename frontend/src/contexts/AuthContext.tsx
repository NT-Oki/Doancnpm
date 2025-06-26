// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URLS, { apiRequest } from '../config/api';

type User = { 
  email: string; 
  userId: string; 
  avatar: string; 
  name: string; 
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
  gender?: boolean;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const login = useCallback((userData: User, token: string) => {
        console.log('Login called with:', userData, token);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    }, []);

    const updateUser = useCallback((userData: Partial<User>) => {
        setUser(prevUser => {
            if (prevUser) {
                const updatedUser = { 
                    ...prevUser, 
                    ...userData,
                    // Đảm bảo các field quan trọng không bị undefined
                    phoneNumber: userData.phoneNumber !== undefined ? userData.phoneNumber : prevUser.phoneNumber || '',
                    address: userData.address !== undefined ? userData.address : prevUser.address || '',
                    gender: userData.gender !== undefined ? userData.gender : prevUser.gender
                };
                console.log('Updating user from:', prevUser, 'to:', updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
            return prevUser;
        });
    }, []);

    const logout = useCallback(async () => {
        console.log('Logout called');
        try {
            await apiRequest(API_URLS.AUTH.logout, { method: 'POST' });
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        updateUser
    }), [user, login, logout, updateUser]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // console.log('Stored user:', storedUser);
        // console.log('Stored token:', token);

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Lỗi khi parse user:', error);
                // Không gọi logout ở đây để tránh vòng lặp
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []); // Chỉ chạy một lần khi mount

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
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