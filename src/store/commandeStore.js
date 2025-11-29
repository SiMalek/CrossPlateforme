import { create } from "zustand";
import {
    addCommande,
    getCommandes,
    getCommandesByPatient,
    getCommandesByPharmacien,
    updateCommandeStatus
} from "../api/commandeService";

export const useCommandeStore = create((set) => ({
  commandes: [],
  isLoading: false,

  loadCommandes: async () => {
    set({ isLoading: true });
    const data = await getCommandes();
    set({ commandes: data, isLoading: false });
  },

  loadCommandesByPatient: async (patientId) => {
    console.log('📦 Loading commandes for patient:', patientId);
    set({ isLoading: true });
    const data = await getCommandesByPatient(patientId);
    console.log('📦 Commandes found:', data.length, data);
    set({ commandes: data, isLoading: false });
  },

  loadCommandesByPharmacien: async (pharmacienId) => {
    set({ isLoading: true });
    const data = await getCommandesByPharmacien(pharmacienId);
    set({ commandes: data, isLoading: false });
  },

  addCommande: async (commande) => {
    const updated = await addCommande(commande);
    set({ commandes: updated });
  },

  updateCommandeStatus: async (id, status) => {
    const newList = await updateCommandeStatus(id, status);
    set({ commandes: newList });
  },
}));
