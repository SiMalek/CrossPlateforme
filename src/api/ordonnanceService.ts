import { Ordonnance } from '../types';
import { getItem, saveItem } from './asyncStorage';

const ORDONNANCE_KEY = 'ordonnances';

export const getOrdonnances = async (): Promise<Ordonnance[]> => {
    return (await getItem<Ordonnance[]>(ORDONNANCE_KEY)) || [];
};

export const addOrdonnance = async (ordonnance: Ordonnance): Promise<Ordonnance[]> => {
    const ords = await getOrdonnances();
    const newList = [...ords, ordonnance];
    await saveItem(ORDONNANCE_KEY, newList);
    return newList;
};

export const updateOrdonnance = async (id: string, updated: Partial<Ordonnance>): Promise<Ordonnance[]> => {
    const ords = await getOrdonnances();
    const newList = ords.map((o) => (o.id === id ? { ...o, ...updated } : o));
    await saveItem(ORDONNANCE_KEY, newList);
    return newList;
};

export const deleteOrdonnance = async (id: string): Promise<Ordonnance[]> => {
    const ords = await getOrdonnances();
    const newList = ords.filter((o) => o.id !== id);
    await saveItem(ORDONNANCE_KEY, newList);
    return newList;
};

export const getOrdonnanceById = async (id: string): Promise<Ordonnance | null> => {
    const ords = await getOrdonnances();
    return ords.find((o) => o.id === id) || null;
};

export const getOrdonnancesByPatientId = async (patientId: string): Promise<Ordonnance[]> => {
    const ords = await getOrdonnances();
    return ords.filter((o) => o.patientId === patientId);
};

export const getOrdonnancesByMedecinId = async (medecinId: string): Promise<Ordonnance[]> => {
    const ords = await getOrdonnances();
    return ords.filter((o) => o.medecinId === medecinId);
};
