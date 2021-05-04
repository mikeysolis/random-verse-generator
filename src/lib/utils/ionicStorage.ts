/**
 * Standard implementation of @ionic/storage. Allows us
 * to create a storage object for saving persistant data in our app.
 */

import { Storage, Drivers } from '@ionic/storage';

let storage: any = false;

// Create the storage object
export const createStorage = async (name = '__mydb') => {
  storage = new Storage({
    name,
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  await storage.create();
};

// Save a key value pair to storage
export const set = (key: any, val: any) => {
  storage.set(key, val);
};

// Retrieve a key value pair from storage
export const get = async (key: any) => {
  const val = await storage.get(key);
  return val;
};

export const remove = async (key: any) => {
  await storage.remove(key);
};

export const clear = async () => {
  await storage.clear();
};

export const setObject = async (key: any, id: any, val: any) => {
  const all = await storage.get(key);
  const objIndex = await all.findIndex(
    (a: any) => parseInt(a.id) === parseInt(id)
  );

  all[objIndex] = val;
  set(key, all);
};

export const removeObject = async (key: any, id: any) => {
  const all = await storage.get(key);
  const objIndex = await all.findIndex(
    (a: any) => parseInt(a.id) === parseInt(id)
  );

  all.splice(objIndex, 1);
  set(key, all);
};

export const getObject = async (key: any, id: any) => {
  const all = await storage.get(key);
  const obj = await all.filter((a: any) => parseInt(a.id) === parseInt(id))[0];
  return obj;
};
