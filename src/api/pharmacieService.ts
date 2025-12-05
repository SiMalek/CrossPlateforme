import { Pharmacie } from '../types';
import { getItem, saveItem } from './asyncStorage';

const PHARMACIE_KEY = 'pharmacies';

export const getPharmacies = async (): Promise<Pharmacie[]> => {
    return (await getItem<Pharmacie[]>(PHARMACIE_KEY)) || [];
};

export const addPharmacie = async (pharmacie: Pharmacie): Promise<Pharmacie[]> => {
    const pharms = await getPharmacies();
    const newList = [...pharms, pharmacie];
    await saveItem(PHARMACIE_KEY, newList);
    return newList;
};

export const getPharmacieById = async (id: string): Promise<Pharmacie | null> => {
    const pharms = await getPharmacies();
    return pharms.find((p) => p.id === id) || null;
};
