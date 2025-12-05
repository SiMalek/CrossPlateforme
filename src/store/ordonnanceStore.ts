import { create } from 'zustand';
import {
    addOrdonnance,
    getOrdonnanceById,
    getOrdonnances,
    getOrdonnancesByPatientId,
    updateOrdonnance,
} from '../api/ordonnanceService';
import { Ordonnance } from '../types';

interface OrdonnanceState {
    ordonnances: Ordonnance[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadOrdonnances: () => Promise<void>;
    loadOrdonnancesByPatient: (patientId: string) => Promise<void>;
    addOrdonnance: (ordonnance: Ordonnance) => Promise<void>;
    updateOrdonnance: (id: string, updated: Partial<Ordonnance>) => Promise<void>;
    getOrdonnanceById: (id: string) => Promise<Ordonnance | null>;
    clearError: () => void;
}

export const useOrdonnanceStore = create<OrdonnanceState>((set) => ({
    ordonnances: [],
    isLoading: false,
    error: null,

    loadOrdonnances: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getOrdonnances();
            set({ ordonnances: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des ordonnances', isLoading: false });
        }
    },

    loadOrdonnancesByPatient: async (patientId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getOrdonnancesByPatientId(patientId);
            set({ ordonnances: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des ordonnances', isLoading: false });
        }
    },

    addOrdonnance: async (ordonnance) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await addOrdonnance(ordonnance);
            set({ ordonnances: updated, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors de l\'ajout de l\'ordonnance', isLoading: false });
        }
    },

    updateOrdonnance: async (id, updated) => {
        set({ isLoading: true, error: null });
        try {
            const newList = await updateOrdonnance(id, updated);
            set({ ordonnances: newList, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors de la mise à jour de l\'ordonnance', isLoading: false });
        }
    },

    getOrdonnanceById: async (id) => {
        try {
            return await getOrdonnanceById(id);
        } catch (error) {
            set({ error: 'Erreur lors de la récupération de l\'ordonnance' });
            return null;
        }
    },

    clearError: () => set({ error: null }),
}));
