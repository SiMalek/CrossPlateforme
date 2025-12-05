// Data initialization service for seeding the app with realistic data
import { Commande, Medicament, Ordonnance } from '../types';
import { addCommande, getCommandes } from './commandeService';
import { addMedicament, getMedicaments } from './medicamentService';
import { addOrdonnance, getOrdonnances } from './ordonnanceService';

// Helper function to format date as ISO string
const formatDateISO = (date: Date): string => {
    return date.toISOString();
};

// Real French Medications
const INITIAL_MEDICATIONS: Medicament[] = [
    {
        id: 'med_001',
        nom: 'Doliprane',
        dosage: '1000',
        forme: 'Comprimé',
        quantiteStock: 150,
        fabricant: 'Sanofi',
    },
    {
        id: 'med_002',
        nom: 'Amoxicilline',
        dosage: '500',
        forme: 'Gélule',
        quantiteStock: 80,
        fabricant: 'Biogaran',
    },
    {
        id: 'med_003',
        nom: 'Ibuprofène',
        dosage: '400',
        forme: 'Comprimé',
        quantiteStock: 120,
        fabricant: 'Pfizer',
    },
    {
        id: 'med_004',
        nom: 'Ventoline',
        dosage: '100',
        forme: 'Inhalateur',
        quantiteStock: 45,
        fabricant: 'GSK',
    },
    {
        id: 'med_005',
        nom: 'Kardégic',
        dosage: '75',
        forme: 'Poudre',
        quantiteStock: 90,
        fabricant: 'Sanofi',
    },
    {
        id: 'med_006',
        nom: 'Levothyrox',
        dosage: '50',
        forme: 'Comprimé',
        quantiteStock: 65,
        fabricant: 'Merck',
    },
    {
        id: 'med_007',
        nom: 'Spasfon',
        dosage: '80',
        forme: 'Comprimé',
        quantiteStock: 110,
        fabricant: 'Teva',
    },
    {
        id: 'med_008',
        nom: 'Efferalgan',
        dosage: '500',
        forme: 'Comprimé effervescent',
        quantiteStock: 95,
        fabricant: 'UPSA',
    },
    {
        id: 'med_009',
        nom: 'Augmentin',
        dosage: '1000',
        forme: 'Comprimé',
        quantiteStock: 55,
        fabricant: 'GSK',
    },
    {
        id: 'med_010',
        nom: 'Smecta',
        dosage: '3000',
        forme: 'Poudre',
        quantiteStock: 70,
        fabricant: 'Ipsen',
    },
    {
        id: 'med_011',
        nom: 'Cétirizine',
        dosage: '10',
        forme: 'Comprimé',
        quantiteStock: 85,
        fabricant: 'Biogaran',
    },
    {
        id: 'med_012',
        nom: 'Oméprazole',
        dosage: '20',
        forme: 'Gélule',
        quantiteStock: 92,
        fabricant: 'Sandoz',
    },
];

// Sample Prescriptions for test user (jean.dupont@patient.fr - ID: u222)
// Use the same medication IDs as seedData.ts (m001, m002, etc.) for consistency
const INITIAL_ORDONNANCES: Ordonnance[] = [
    {
        id: 'ord_001',
        patientId: 'u222',
        medecinId: 'u111',
        date: formatDateISO(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
        dateExpiration: formatDateISO(new Date(Date.now() + 88 * 24 * 60 * 60 * 1000)), // 90 days from creation
        medicaments: [
            { idMedicament: 'm001', quantiteParJour: 3, duree: 7 },
            { idMedicament: 'm002', quantiteParJour: 2, duree: 5 },
        ],
        isUsed: false,
    },
    {
        id: 'ord_002',
        patientId: 'u222',
        medecinId: 'u111',
        date: formatDateISO(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
        dateExpiration: formatDateISO(new Date(Date.now() + 85 * 24 * 60 * 60 * 1000)),
        medicaments: [
            { idMedicament: 'm003', quantiteParJour: 3, duree: 10 },
        ],
        isUsed: false,
    },
    {
        id: 'ord_003',
        patientId: 'u222',
        medecinId: 'u111',
        date: formatDateISO(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)), // 10 days ago
        dateExpiration: formatDateISO(new Date(Date.now() + 80 * 24 * 60 * 60 * 1000)),
        medicaments: [
            { idMedicament: 'm005', quantiteParJour: 2, duree: 30 },
            { idMedicament: 'm006', quantiteParJour: 1, duree: 30 },
        ],
        isUsed: false,
    },
    {
        id: 'ord_004',
        patientId: 'u444',
        medecinId: 'u111',
        date: formatDateISO(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)), // 1 day ago
        dateExpiration: formatDateISO(new Date(Date.now() + 89 * 24 * 60 * 60 * 1000)),
        medicaments: [
            { idMedicament: 'm006', quantiteParJour: 1, duree: 90 },
        ],
        isUsed: false,
    },
    {
        id: 'ord_005',
        patientId: 'u555',
        medecinId: 'u111',
        date: formatDateISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
        dateExpiration: formatDateISO(new Date(Date.now() + 83 * 24 * 60 * 60 * 1000)),
        medicaments: [
            { idMedicament: 'm007', quantiteParJour: 3, duree: 5 },
            { idMedicament: 'm003', quantiteParJour: 1, duree: 10 },
        ],
        isUsed: false,
    },
];
// Sample Commands - use pharmacieId instead of pharmacienId
const INITIAL_COMMANDES: Commande[] = [
    {
        id: 'cmd_001',
        ordonnanceId: 'ord_002',
        patientId: 'u222',
        pharmacieId: 'ph001', // Pharmacie Centrale
        status: 'EN_PREPARATION',
        dateCreation: formatDateISO(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
        lieuLivraison: '10 rue des Lilas, 75001 Paris',
        remarques: 'Livraison avant 18h svp',
    },
    {
        id: 'cmd_002',
        ordonnanceId: 'ord_004',
        patientId: 'u444',
        pharmacieId: 'ph002', // Pharmacie du Marché
        status: 'EN_ATTENTE',
        dateCreation: formatDateISO(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        lieuLivraison: '25 avenue Victor Hugo, 75016 Paris',
        remarques: '',
    },
    {
        id: 'cmd_003',
        ordonnanceId: 'ord_005',
        patientId: 'u555',
        pharmacieId: 'ph001', // Pharmacie Centrale
        status: 'PRETE',
        dateCreation: formatDateISO(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
        lieuLivraison: '8 boulevard Haussmann, 75009 Paris',
        remarques: 'Appeler avant livraison',
    },
];

export const initializeAppData = async (): Promise<void> => {
    try {
        // Check if data already exists
        const existingMeds = await getMedicaments();
        const existingOrds = await getOrdonnances();
        const existingCmds = await getCommandes();

        // Only initialize if empty
        if (existingMeds.length === 0) {
            console.log('Initializing medications...');
            for (const med of INITIAL_MEDICATIONS) {
                await addMedicament(med);
            }
        }

        if (existingOrds.length === 0) {
            console.log('Initializing prescriptions...');
            for (const ord of INITIAL_ORDONNANCES) {
                await addOrdonnance(ord);
            }
        }

        if (existingCmds.length === 0) {
            console.log('Initializing commands...');
            for (const cmd of INITIAL_COMMANDES) {
                await addCommande(cmd);
            }
        }

        console.log('App data initialization complete');
    } catch (error) {
        console.error('Error initializing app data:', error);
    }
};
