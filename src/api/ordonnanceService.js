import { getItem, saveItem } from "./asyncStorage";

const ORDONNANCE_KEY = "ordonnances";

export const getOrdonnances = async () => {
  return (await getItem(ORDONNANCE_KEY)) || [];
};

export const addOrdonnance = async (ordonnance) => {
  const ords = await getOrdonnances();
  const newList = [...ords, ordonnance];
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};

export const updateOrdonnance = async (id, updated) => {
  const ords = await getOrdonnances();
  const newList = ords.map((o) => (o.id === id ? { ...o, ...updated } : o));
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};

export const getOrdonnancesByPatient = async (patientId) => {
  const ords = await getOrdonnances();
  console.log('📦 All ordonnances:', ords.length);
  console.log('🔍 Filtering by patientId:', patientId);
  const filtered = ords.filter((o) => {
    console.log(`Checking ordonnance ${o.id}: ${o.patientId} === ${patientId}?`, o.patientId === patientId);
    return o.patientId === patientId;
  });
  console.log('✅ Filtered ordonnances:', filtered.length);
  return filtered;
};
