import { getItem, saveItem } from '../api/asyncStorage';
import { Medicament, Ordonnance, Patient, Pharmacie, User } from '../types';

// Import JSON data
import pharmacieListData from '../data/pharmacieList.json';

// Key to track if seed data has been initialized
const SEED_INITIALIZED_KEY = 'seed_data_initialized';

// Test Users
export const seedUsers: User[] = [
    {
        id: 'u111',
        role: 'medecin',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@medecin.fr',
        password: 'medecin123',
    },
    {
        id: 'u222',
        role: 'patient',
        name: 'Jean Dupont',
        email: 'jean@patient.fr',
        password: 'patient123',
    },
    {
        id: 'u333',
        role: 'pharmacien',
        name: 'Marie Dubois',
        email: 'marie@pharmacie.fr',
        password: 'pharmacien123',
    },
    {
        id: 'u444',
        role: 'patient',
        name: 'Alice Bernard',
        email: 'alice.bernard@patient.fr',
        password: 'patient123',
    },
    {
        id: 'u555',
        role: 'patient',
        name: 'Pierre Leroy',
        email: 'pierre.leroy@patient.fr',
        password: 'patient123',
    },
    {
        id: 'u666',
        role: 'pharmacien',
        name: 'Thomas Petit',
        email: 'thomas@pharmacie.fr',
        password: 'pharmacien123',
    },
];

// Test Patients
export const seedPatients: Patient[] = [
    {
        id: 'u222',
        name: 'Jean Dupont',
        age: 45,
        adresse: '10 rue des Lilas, 75001 Paris',
        telephone: '0612345678',
    },
    {
        id: 'u444',
        name: 'Alice Bernard',
        age: 32,
        adresse: '25 avenue Victor Hugo, 75016 Paris',
        telephone: '0623456789',
    },
    {
        id: 'u555',
        name: 'Pierre Leroy',
        age: 58,
        adresse: '8 boulevard Haussmann, 75009 Paris',
        telephone: '0634567890',
    },
];

// Test Medications
export const seedMedicaments: Medicament[] = [
    {
        id: 'm001',
        nom: 'Doliprane',
        dosage: '500',
        forme: 'Comprimé',
        quantiteStock: 120,
        fabricant: 'Sanofi',
    },
    {
        id: 'm002',
        nom: 'Ibuprofène',
        dosage: '400',
        forme: 'Comprimé',
        quantiteStock: 80,
        fabricant: 'Pfizer',
    },
    {
        id: 'm003',
        nom: 'Amoxicilline',
        dosage: '1000',
        forme: 'Gélule',
        quantiteStock: 50,
        fabricant: 'Generic',
    },
    {
        id: 'm004',
        nom: 'Sirop pour la toux',
        dosage: '200',
        forme: 'Sirop',
        quantiteStock: 30,
        fabricant: 'Sanofi',
    },
    {
        id: 'm005',
        nom: 'Ventoline',
        dosage: '100',
        forme: 'Inhalateur',
        quantiteStock: 45,
        fabricant: 'GSK',
    },
    {
        id: 'm006',
        nom: 'Levothyrox',
        dosage: '50',
        forme: 'Comprimé',
        quantiteStock: 65,
        fabricant: 'Merck',
    },
    {
        id: 'm007',
        nom: 'Spasfon',
        dosage: '80',
        forme: 'Comprimé',
        quantiteStock: 110,
        fabricant: 'Teva',
    },
    {
        id: 'm008',
        nom: 'Augmentin',
        dosage: '1000',
        forme: 'Comprimé',
        quantiteStock: 55,
        fabricant: 'GSK',
    },
];

// Test Ordonnances
export const seedOrdonnances: Ordonnance[] = [
    {
        id: 'o888',
        patientId: 'u222',
        medecinId: 'u111',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        dateExpiration: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from creation
        medicaments: [
            {
                idMedicament: 'm001',
                quantiteParJour: 3,
                duree: 7,
            },
            {
                idMedicament: 'm003',
                quantiteParJour: 2,
                duree: 5,
            },
        ],
        isUsed: false,
    },
    {
        id: 'o889',
        patientId: 'u222',
        medecinId: 'u111',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dateExpiration: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString(),
        medicaments: [
            {
                idMedicament: 'm002',
                quantiteParJour: 2,
                duree: 3,
            },
        ],
        isUsed: false,
    },
    {
        id: 'o890',
        patientId: 'u444',
        medecinId: 'u111',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dateExpiration: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString(),
        medicaments: [
            {
                idMedicament: 'm005',
                quantiteParJour: 2,
                duree: 30,
            },
        ],
        isUsed: false,
    },
    {
        id: 'o891',
        patientId: 'u555',
        medecinId: 'u111',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dateExpiration: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000).toISOString(),
        medicaments: [
            {
                idMedicament: 'm006',
                quantiteParJour: 1,
                duree: 90,
            },
            {
                idMedicament: 'm007',
                quantiteParJour: 3,
                duree: 5,
            },
        ],
        isUsed: false,
    },
];

// Load pharmacies from JSON file with all extended data
export const seedPharmacies: Pharmacie[] = pharmacieListData as Pharmacie[];

// Seed function to initialize AsyncStorage
// Only initializes data if it hasn't been done before (first launch)
export const initializeSeedData = async (): Promise<void> => {
    try {
        // Check if seed data has already been initialized
        const isInitialized = await getItem<boolean>(SEED_INITIALIZED_KEY);

        if (isInitialized) {
            console.log('ℹ️ Seed data already exists, skipping initialization');
            return;
        }

        // First time: initialize all seed data
        await saveItem('users', seedUsers);
        await saveItem('patients', seedPatients);
        await saveItem('medicaments', seedMedicaments);
        await saveItem('ordonnances', seedOrdonnances);
        await saveItem('pharmacies', seedPharmacies);
        await saveItem('commandes', []); // Empty initially

        // Mark as initialized so we don't overwrite data on next launch
        await saveItem(SEED_INITIALIZED_KEY, true);

        console.log('✅ Seed data initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing seed data:', error);
        throw error;
    }
};

// Force reset all seed data (useful for development/testing)
export const resetSeedData = async (): Promise<void> => {
    try {
        // Remove the initialized flag first
        await saveItem(SEED_INITIALIZED_KEY, false);

        // Clear all existing data
        await saveItem('users', []);
        await saveItem('patients', []);
        await saveItem('medicaments', []);
        await saveItem('ordonnances', []);
        await saveItem('pharmacies', []);
        await saveItem('commandes', []);
        await saveItem('session', null);

        // Reinitialize with fresh seed data
        await initializeSeedData();

        console.log('✅ Seed data reset successfully');
    } catch (error) {
        console.error('❌ Error resetting seed data:', error);
        throw error;
    }
};
