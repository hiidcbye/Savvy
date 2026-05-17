import { useState } from 'react';
import { api } from '../services/api';

let globalUserId = null;
let globalSetUserId = null;

export function useAuth() {
    const [userId, setUserId] = useState(globalUserId);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    globalSetUserId = (id) => {
        globalUserId = id;
        setUserId(id);
    };

    const signIn = async (email, password) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.signin(email, password);
            if (data.access_token) {
                globalUserId = data.user_id;
                setUserId(data.user_id);
                setIsLoading(false);
                return true;
            }
            setError('Invalid credentials');
            setIsLoading(false);
            return false;
        } catch {
            setError('Something went wrong');
            setIsLoading(false);
            return false;
        }
    };

    const signUp = async (email, password, name) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.signup(email, password, name);
            if (data.user_id) {
                globalUserId = data.user_id;
                setUserId(data.user_id);
                setIsLoading(false);
                return true;
            }
            setError('Signup failed');
            setIsLoading(false);
            return false;
        } catch {
            setError('Something went wrong');
            setIsLoading(false);
            return false;
        }
    };

    const signOut = () => {
        globalUserId = null;
        setUserId(null);
    };

    return { userId, isLoading, error, signIn, signUp, signOut };
}