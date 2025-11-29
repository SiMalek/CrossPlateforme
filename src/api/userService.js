import { getItem, saveItem } from "./asyncStorage";

const USER_KEY = "users";

export const getUsers = async () => {
  return (await getItem(USER_KEY)) || [];
};

export const addUser = async (user) => {
  const users = await getUsers();
  const newList = [...users, user];
  await saveItem(USER_KEY, newList);
  return newList;
};

export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((u) => u.email === email);
};

export const authenticateUser = async (email, password) => {
  const users = await getUsers();
  console.log("Total users in database:", users.length);
  console.log("Searching for user:", email);
  
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    console.log("User found:", user.name);
  } else {
    console.log("User not found. Available emails:", users.map(u => u.email));
  }
  
  return user;
};
