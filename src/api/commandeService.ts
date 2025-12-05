import { Commande, CommandeStatus } from '../types';
import { getItem, saveItem } from './asyncStorage';

const COMMANDE_KEY = 'commandes';

export const getCommandes = async (): Promise<Commande[]> => {
    return (await getItem<Commande[]>(COMMANDE_KEY)) || [];
};

export const addCommande = async (commande: Commande): Promise<Commande[]> => {
    const cmds = await getCommandes();
    const newList = [...cmds, commande];
    await saveItem(COMMANDE_KEY, newList);
    return newList;
};

export const updateCommande = async (id: string, updated: Partial<Commande>): Promise<Commande[]> => {
    const cmds = await getCommandes();
    const newList = cmds.map((c) => (c.id === id ? { ...c, ...updated } : c));
    await saveItem(COMMANDE_KEY, newList);
    return newList;
};

export const updateCommandeStatus = async (id: string, status: CommandeStatus, preparedMedicaments?: Record<string, boolean>): Promise<Commande[]> => {
    const cmds = await getCommandes();
    const newList = cmds.map((c) => (c.id === id ? { ...c, status, preparedMedicaments: preparedMedicaments || c.preparedMedicaments } : c));
    await saveItem(COMMANDE_KEY, newList);
    return newList;
};

export const deleteCommande = async (id: string): Promise<Commande[]> => {
    const cmds = await getCommandes();
    const newList = cmds.filter((c) => c.id !== id);
    await saveItem(COMMANDE_KEY, newList);
    return newList;
};

export const getCommandeById = async (id: string): Promise<Commande | null> => {
    const cmds = await getCommandes();
    return cmds.find((c) => c.id === id) || null;
};

export const getCommandesByPatientId = async (patientId: string): Promise<Commande[]> => {
    const cmds = await getCommandes();
    return cmds.filter((c) => c.patientId === patientId);
};

export const getCommandesByPharmacieId = async (pharmacieId: string): Promise<Commande[]> => {
    const cmds = await getCommandes();
    return cmds.filter((c) => c.pharmacieId === pharmacieId);
};

// Get commandes for a pharmacist based on their linked pharmacies
export const getCommandesByPharmacienId = async (pharmacienId: string, pharmacieIds: string[]): Promise<Commande[]> => {
    const cmds = await getCommandes();
    return cmds.filter((c) => pharmacieIds.includes(c.pharmacieId));
};

export const getCommandesByStatus = async (status: CommandeStatus): Promise<Commande[]> => {
    const cmds = await getCommandes();
    return cmds.filter((c) => c.status === status);
};
