import { create } from 'zustand';
import {
    addMedicament,
    deleteMedicament,
    getMedicamentById,
    getMedicaments,
    updateMedicament,
} from '../api/medicamentService';
import { Medicament } from '../types';

interface MedicamentState {
    medicaments: Medicament[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadMedicaments: () => Promise<void>;
    addMedicament: (med: Medicament) => Promise<void>;
    updateMedicament: (id: string, updated: Partial<Medicament>) => Promise<void>;
    deleteMedicament: (id: string) => Promise<void>;
    getMedicamentById: (id: string) => Promise<Medicament | null>;
    clearError: () => void;
}

export const useMedicamentStore = create<MedicamentState>((set, get) => ({
    medicaments: [],
    isLoading: false,
    error: null,

    loadMedicaments: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getMedicaments();
            set({ medicaments: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des médicaments', isLoading: false });
        }
    },

    addMedicament: async (med) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await addMedicament(med);
            set({ medicaments: updated, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors de l\'ajout du médicament', isLoading: false });
        }
    },

    updateMedicament: async (id, updated) => {
        set({ isLoading: true, error: null });
        try {
            const newList = await updateMedicament(id, updated);
            set({ medicaments: newList, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors de la mise à jour du médicament', isLoading: false });
        }
    },

    deleteMedicament: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const newList = await deleteMedicament(id);
            set({ medicaments: newList, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du médicament';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getMedicamentById: async (id) => {
        try {
            return await getMedicamentById(id);
        } catch (error) {
            set({ error: 'Erreur lors de la récupération du médicament' });
            return null;
        }
    },

    clearError: () => set({ error: null }),
}));
