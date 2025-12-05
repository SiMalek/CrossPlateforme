// Medicament types
export interface Medicament {
    id: string;
    nom: string;
    dosage: string;
    forme: string;
    quantiteStock: number;
    fabricant?: string; // Manufacturer
}

export interface MedicamentFormData {
    nom: string;
    dosage: string;
    forme: string;
    quantiteStock: number;
    fabricant?: string;
}
