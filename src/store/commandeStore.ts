import { create } from 'zustand';
import {
    addCommande,
    getCommandeById,
    getCommandes,
    getCommandesByPatientId,
    getCommandesByPharmacienId,
    updateCommandeStatus,
} from '../api/commandeService';
import { getMedicamentById, updateMedicamentStock } from '../api/medicamentService';
import { getOrdonnanceById, updateOrdonnance } from '../api/ordonnanceService';
import { getPharmacies } from '../api/pharmacieService';
import { Commande, CommandeStatus } from '../types';

interface CommandeState {
    commandes: Commande[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadCommandes: () => Promise<void>;
    loadCommandesByPatient: (patientId: string) => Promise<void>;
    loadCommandesByPharmacien: (pharmacienId: string) => Promise<void>;
    addCommande: (commande: Commande) => Promise<void>;
    updateCommandeStatus: (id: string, status: CommandeStatus, preparedMedicaments?: Record<string, boolean>) => Promise<void>;
    getCommandeById: (id: string) => Promise<Commande | null>;
    clearError: () => void;
}

export const useCommandeStore = create<CommandeState>((set, get) => ({
    commandes: [],
    isLoading: false,
    error: null,

    loadCommandes: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getCommandes();
            set({ commandes: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des commandes', isLoading: false });
        }
    },

    loadCommandesByPatient: async (patientId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getCommandesByPatientId(patientId);
            set({ commandes: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des commandes', isLoading: false });
        }
    },

    loadCommandesByPharmacien: async (pharmacienId: string) => {
        set({ isLoading: true, error: null });
        try {
            // Get pharmacies where this pharmacist works
            const pharmacies = await getPharmacies();
            const pharmacienPharmacies = pharmacies.filter(
                p => p.pharmacienIds?.includes(pharmacienId)
            );
            const pharmacieIds = pharmacienPharmacies.map(p => p.id);

            const data = await getCommandesByPharmacienId(pharmacienId, pharmacieIds);
            set({ commandes: data, isLoading: false });
        } catch (error) {
            set({ error: 'Erreur lors du chargement des commandes', isLoading: false });
        }
    },

    addCommande: async (commande) => {
        set({ isLoading: true, error: null });
        try {
            // Check if ordonnance is already used
            const ordonnance = await getOrdonnanceById(commande.ordonnanceId);
            if (ordonnance?.isUsed) {
                throw new Error('Cette ordonnance a déjà été utilisée pour une commande');
            }

            // Check if ordonnance is expired
            if (ordonnance?.dateExpiration && new Date(ordonnance.dateExpiration) < new Date()) {
                throw new Error('Cette ordonnance est expirée');
            }

            // Check if all medications in the ordonnance still exist and have stock
            if (ordonnance && ordonnance.medicaments) {
                for (const med of ordonnance.medicaments) {
                    const medicament = await getMedicamentById(med.idMedicament);
                    if (!medicament) {
                        throw new Error(`Le médicament prescrit n'est plus disponible dans le catalogue`);
                    }
                    const totalQuantity = med.quantiteParJour * med.duree;
                    if (medicament.quantiteStock < totalQuantity) {
                        throw new Error(`Stock insuffisant pour ${medicament.nom} (besoin: ${totalQuantity}, disponible: ${medicament.quantiteStock})`);
                    }
                }
            }

            // Mark the ordonnance as used
            await updateOrdonnance(commande.ordonnanceId, { isUsed: true });

            const updated = await addCommande(commande);
            set({ commandes: updated, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la commande';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    updateCommandeStatus: async (id, status, preparedMedicaments) => {
        set({ isLoading: true, error: null });
        try {
            // Get the commande to access its medications
            const commande = await getCommandeById(id);

            if (!commande) {
                throw new Error('Commande not found');
            }

            // Get ordonnance to get medication details
            const ordonnance = await getOrdonnanceById(commande.ordonnanceId);

            // Define which statuses mean stock was already deducted
            const stockDeductedStatuses = ['PRETE', 'RECUPEREE'];
            const wasStockDeducted = stockDeductedStatuses.includes(commande.status);
            const willStockBeDeducted = stockDeductedStatuses.includes(status);

            // If status is changing to PRETE (and stock wasn't already deducted), decrease stock
            if (status === 'PRETE' && !wasStockDeducted) {
                if (ordonnance && ordonnance.medicaments) {
                    // Check stock availability first
                    for (const med of ordonnance.medicaments) {
                        const totalQuantity = med.quantiteParJour * med.duree;
                        const medicament = await getMedicamentById(med.idMedicament);
                        if (!medicament) {
                            throw new Error(`Médicament non trouvé dans l'inventaire`);
                        }
                        if (medicament.quantiteStock < totalQuantity) {
                            throw new Error(`Stock insuffisant pour ${medicament.nom} (besoin: ${totalQuantity}, disponible: ${medicament.quantiteStock})`);
                        }
                    }
                    // Decrease stock for each medication
                    for (const med of ordonnance.medicaments) {
                        const totalQuantity = med.quantiteParJour * med.duree;
                        await updateMedicamentStock(med.idMedicament, -totalQuantity);
                    }
                }
            }

            // If status is changing to RETOURNEE from a status where stock was deducted, restore stock
            if (status === 'RETOURNEE' && wasStockDeducted) {
                if (ordonnance && ordonnance.medicaments) {
                    // Restore stock for each medication
                    for (const med of ordonnance.medicaments) {
                        const totalQuantity = med.quantiteParJour * med.duree;
                        await updateMedicamentStock(med.idMedicament, totalQuantity);
                    }
                }
            }

            // If going back from PRETE/RECUPEREE to EN_ATTENTE or EN_PREPARATION, restore stock
            if (!willStockBeDeducted && status !== 'RETOURNEE' && wasStockDeducted) {
                if (ordonnance && ordonnance.medicaments) {
                    for (const med of ordonnance.medicaments) {
                        const totalQuantity = med.quantiteParJour * med.duree;
                        await updateMedicamentStock(med.idMedicament, totalQuantity);
                    }
                }
            }

            const newList = await updateCommandeStatus(id, status, preparedMedicaments);
            set({ commandes: newList, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getCommandeById: async (id) => {
        try {
            return await getCommandeById(id);
        } catch (error) {
            set({ error: 'Erreur lors de la récupération de la commande' });
            return null;
        }
    },

    clearError: () => set({ error: null }),
}));
