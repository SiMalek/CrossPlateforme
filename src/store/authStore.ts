import { create } from 'zustand';
import {
    authenticateUser,
    clearSession,
    getSession,
    saveSession,
} from '../api/userService';
import { User } from '../types';

interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string, role: string) => Promise<boolean>;
    logout: () => Promise<void>;
    loadSession: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string, role: string) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authenticateUser(email, password, role);
            if (user) {
                await saveSession(user);
                set({
                    currentUser: user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                // Data is already initialized by seedData in AppNavigator
                return true;
            } else {
                set({
                    error: 'Email, mot de passe ou rôle incorrect',
                    isLoading: false,
                });
                return false;
            }
        } catch (error) {
            set({
                error: 'Erreur lors de la connexion',
                isLoading: false,
            });
            return false;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await clearSession();
            set({
                currentUser: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({ error: 'Erreur lors de la déconnexion', isLoading: false });
        }
    },

    loadSession: async () => {
        set({ isLoading: true });
        try {
            const user = await getSession();
            if (user) {
                set({
                    currentUser: user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));
