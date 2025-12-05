import { User } from '../types';
import { getItem, saveItem } from './asyncStorage';

const USER_KEY = 'users';
const SESSION_KEY = 'session';

export const getUsers = async (): Promise<User[]> => {
    return (await getItem<User[]>(USER_KEY)) || [];
};

export const addUser = async (user: User): Promise<User[]> => {
    const users = await getUsers();
    const newList = [...users, user];
    await saveItem(USER_KEY, newList);
    return newList;
};

export const updateUser = async (id: string, updated: Partial<User>): Promise<User[]> => {
    const users = await getUsers();
    const newList = users.map((u) => (u.id === id ? { ...u, ...updated } : u));
    await saveItem(USER_KEY, newList);
    return newList;
};

export const deleteUser = async (id: string): Promise<User[]> => {
    const users = await getUsers();
    const newList = users.filter((u) => u.id !== id);
    await saveItem(USER_KEY, newList);
    return newList;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const users = await getUsers();
    return users.find((u) => u.email === email) || null;
};

export const authenticateUser = async (
    email: string,
    password: string,
    role: string
): Promise<User | null> => {
    const user = await getUserByEmail(email);
    if (user && user.password === password && user.role === role) {
        return user;
    }
    return null;
};

export const saveSession = async (user: User): Promise<void> => {
    await saveItem(SESSION_KEY, user);
};

export const getSession = async (): Promise<User | null> => {
    return await getItem<User>(SESSION_KEY);
};

export const clearSession = async (): Promise<void> => {
    await saveItem(SESSION_KEY, null);
};
