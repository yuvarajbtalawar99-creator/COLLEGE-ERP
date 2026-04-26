import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setApiAccessToken } from '../api/axios';
import { supabase, supabaseConfigError } from '../lib/supabase';

const AuthContext = createContext(null);

const parseJwtPayload = (token) => {
    if (!token) return null;
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(normalized);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

const buildFallbackUserFromToken = (token) => {
    const claims = parseJwtPayload(token);
    if (!claims) return null;
    return {
        id: claims.user_id || claims.sub || null,
        email: claims.email || null,
        role:
            claims.app_metadata?.role ||
            claims.user_metadata?.role ||
            'STUDENT',
        supabaseUserId: claims.sub || null,
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) {
            console.error(supabaseConfigError);
            setLoading(false);
            return;
        }

        const syncSession = async () => {
            const { data } = await supabase.auth.getSession();
            const accessToken = data.session?.access_token || null;
            setToken(accessToken);
            setApiAccessToken(accessToken);
            if (!accessToken) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to fetch authenticated profile', error);
                // Fall back to JWT claims so login routing still works
                setUser(buildFallbackUserFromToken(accessToken));
            } finally {
                setLoading(false);
            }
        };

        syncSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const accessToken = session?.access_token || null;
            setToken(accessToken);
            setApiAccessToken(accessToken);
            if (!accessToken) {
                setUser(null);
                return;
            }
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to refresh authenticated profile', error);
                setUser(buildFallbackUserFromToken(accessToken));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = () => {
        navigate('/');
    };

    const logout = async () => {
        if (!supabase) {
            setToken(null);
            setApiAccessToken(null);
            setUser(null);
            navigate('/login');
            return;
        }
        await supabase.auth.signOut();
        setToken(null);
        setApiAccessToken(null);
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading context...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
