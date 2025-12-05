import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic AsyncStorage wrapper with type safety
 */

export const saveItem = async <T>(key: string, value: T): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Erreur sauvegarde', error);
        throw error;
    }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lecture', error);
        return null;
    }
};

export const removeItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Erreur suppression', error);
        throw error;
    }
};

export const clearAll = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Erreur clear all', error);
        throw error;
    }
};
