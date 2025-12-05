import { create } from 'zustand';
import { getPharmacieById, getPharmacies } from '../api/pharmacieService';
import { Pharmacie } from '../types';

interface PharmacieState {
    pharmacies: Pharmacie[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadPharmacies: () => Promise<void>;
    getPharmacieById: (id: string) => Promise<Pharmacie | null>;
    clearError: () => void;
}

export const usePharmacieStore = create<PharmacieState>((set) => ({
    pharmacies: [],
    isLoading: false,
    error: null,

    loadPharmacies: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getPharmacies();
            set({ pharmacies: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des pharmacies', isLoading: false });
        }
    },

    getPharmacieById: async (id) => {
        try {
            return await getPharmacieById(id);
        } catch (error) {
            set({ error: 'Erreur lors de la récupération de la pharmacie' });
            return null;
        }
    },

    clearError: () => set({ error: null }),
}));
