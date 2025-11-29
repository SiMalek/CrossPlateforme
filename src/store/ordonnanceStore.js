import { create } from "zustand";
import { addOrdonnance, getOrdonnances, getOrdonnancesByPatient, updateOrdonnance } from "../api/ordonnanceService";

export const useOrdonnanceStore = create((set) => ({
  ordonnances: [],
  isLoading: false,

  loadOrdonnances: async () => {
    set({ isLoading: true });
    const data = await getOrdonnances();
    set({ ordonnances: data, isLoading: false });
  },

  loadOrdonnancesByPatient: async (patientId) => {
    console.log('🔍 Loading ordonnances for patient:', patientId);
    set({ isLoading: true });
    const data = await getOrdonnancesByPatient(patientId);
    console.log('📋 Ordonnances found:', data.length, data);
    set({ ordonnances: data, isLoading: false });
  },

  addOrdonnance: async (ordonnance) => {
    const updated = await addOrdonnance(ordonnance);
    set({ ordonnances: updated });
  },

  updateOrdonnance: async (id, updated) => {
    const newList = await updateOrdonnance(id, updated);
    set({ ordonnances: newList });
  },
}));
