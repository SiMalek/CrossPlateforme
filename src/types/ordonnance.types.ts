// Ordonnance types
export interface MedicamentPrescrit {
    idMedicament: string;
    quantiteParJour: number;
    duree: number; // in days
}

export interface Ordonnance {
    id: string;
    date: string; // ISO date format
    dateExpiration: string; // Prescription expiry date
    medecinId: string;
    patientId: string;
    medicaments: MedicamentPrescrit[];
    isUsed?: boolean; // Whether prescription has been used for an order
}
