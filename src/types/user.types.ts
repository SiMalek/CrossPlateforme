// User types
export interface User {
    id: string;
    role: 'medecin' | 'patient' | 'pharmacien';
    name: string;
    email: string;
    password?: string;
}

export interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
