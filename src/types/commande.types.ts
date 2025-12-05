// Commande types
import { MedicamentPrescrit } from './ordonnance.types';

export type CommandeStatus = 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRETE' | 'RECUPEREE' | 'RETOURNEE';

export interface Commande {
    id: string;
    ordonnanceId: string;
    patientId: string;
    pharmacieId: string; // ID of the pharmacy (not pharmacist)
    status: CommandeStatus;
    dateCreation: string;
    lieuLivraison?: string;
    remarques?: string;
    medicaments?: MedicamentPrescrit[];
    preparedMedicaments?: Record<string, boolean>; // Track which medications are prepared
}

export interface CommandeFormData {
    ordonnanceId: string;
    pharmacieId: string;
    lieuLivraison: string;
    remarques?: string;
}
