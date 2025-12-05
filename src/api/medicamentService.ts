import { Medicament, Ordonnance, Commande } from '../types';
import { getItem, saveItem } from './asyncStorage';

const MEDICAMENT_KEY = 'medicaments';
const ORDONNANCE_KEY = 'ordonnances';
const COMMANDE_KEY = 'commandes';

export const getMedicaments = async (): Promise<Medicament[]> => {
    return (await getItem<Medicament[]>(MEDICAMENT_KEY)) || [];
};

export const addMedicament = async (medicament: Medicament): Promise<Medicament[]> => {
    const meds = await getMedicaments();
    const newList = [...meds, medicament];
    await saveItem(MEDICAMENT_KEY, newList);
    return newList;
};

export const updateMedicament = async (id: string, updated: Partial<Medicament>): Promise<Medicament[]> => {
    const meds = await getMedicaments();
    const newList = meds.map((m) => (m.id === id ? { ...m, ...updated } : m));
    await saveItem(MEDICAMENT_KEY, newList);
    return newList;
};

export const deleteMedicament = async (id: string): Promise<Medicament[]> => {
    // Check if medication is used in any active (non-used, non-expired) ordonnances
    const ordonnances = (await getItem<Ordonnance[]>(ORDONNANCE_KEY)) || [];
    const now = new Date();
    const activeOrdonnances = ordonnances.filter(ord =>
        !ord.isUsed &&
        new Date(ord.dateExpiration) > now &&
        ord.medicaments.some(m => m.idMedicament === id)
    );

    if (activeOrdonnances.length > 0) {
        throw new Error(`Ce médicament est utilisé dans ${activeOrdonnances.length} ordonnance(s) active(s). Impossible de le supprimer.`);
    }

    // Check if medication is in any pending orders (not yet RECUPEREE or RETOURNEE)
    const commandes = (await getItem<Commande[]>(COMMANDE_KEY)) || [];
    const pendingCommandes = commandes.filter(cmd => {
        if (cmd.status === 'RECUPEREE' || cmd.status === 'RETOURNEE') return false;
        const ord = ordonnances.find(o => o.id === cmd.ordonnanceId);
        return ord?.medicaments.some(m => m.idMedicament === id);
    });

    if (pendingCommandes.length > 0) {
        throw new Error(`Ce médicament est dans ${pendingCommandes.length} commande(s) en cours. Impossible de le supprimer.`);
    }

    const meds = await getMedicaments();
    const newList = meds.filter((m) => m.id !== id);
    await saveItem(MEDICAMENT_KEY, newList);
    return newList;
};

export const getMedicamentById = async (id: string): Promise<Medicament | null> => {
    const meds = await getMedicaments();
    return meds.find((m) => m.id === id) || null;
};

export const updateMedicamentStock = async (id: string, quantity: number): Promise<void> => {
    const meds = await getMedicaments();
    const newList = meds.map((m) => {
        if (m.id === id) {
            const newStock = m.quantiteStock + quantity;
            // Prevent negative stock
            return { ...m, quantiteStock: Math.max(0, newStock) };
        }
        return m;
    });
    await saveItem(MEDICAMENT_KEY, newList);
};
