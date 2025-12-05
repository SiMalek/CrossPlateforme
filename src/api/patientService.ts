import { Patient } from '../types';
import { getItem, saveItem } from './asyncStorage';

const PATIENT_KEY = 'patients';

export const getPatients = async (): Promise<Patient[]> => {
    return (await getItem<Patient[]>(PATIENT_KEY)) || [];
};

export const addPatient = async (patient: Patient): Promise<Patient[]> => {
    const patients = await getPatients();
    const newList = [...patients, patient];
    await saveItem(PATIENT_KEY, newList);
    return newList;
};

export const updatePatient = async (id: string, updated: Partial<Patient>): Promise<Patient[]> => {
    const patients = await getPatients();
    const newList = patients.map((p) => (p.id === id ? { ...p, ...updated } : p));
    await saveItem(PATIENT_KEY, newList);
    return newList;
};

export const deletePatient = async (id: string): Promise<Patient[]> => {
    const patients = await getPatients();
    const newList = patients.filter((p) => p.id !== id);
    await saveItem(PATIENT_KEY, newList);
    return newList;
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
    const patients = await getPatients();
    return patients.find((p) => p.id === id) || null;
};
