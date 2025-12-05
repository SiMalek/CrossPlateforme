// Pharmacie types

export interface PharmacieHoraires {
    lundi: string;
    mardi: string;
    mercredi: string;
    jeudi: string;
    vendredi: string;
    samedi: string;
    dimanche: string;
}

export interface PharmacieCoordonnees {
    latitude: number;
    longitude: number;
}

export interface Pharmacie {
    id: string;
    nom: string;
    adresse: string;
    telephone: string;
    pharmacienIds?: string[]; // IDs of pharmacists working at this pharmacy
    // Extended fields (optional for backward compatibility)
    horaires?: PharmacieHoraires;
    services?: string[];
    coordonnees?: PharmacieCoordonnees;
    image?: string;
    note?: number;
    avis?: number;
}
