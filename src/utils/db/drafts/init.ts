import { openDatabase } from 'expo-sqlite';

const db = openDatabase('drafts.db');

export const initDbDrafts = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY NOT NULL, title TEXT, content TEXT);',
        [],
        () => {
          resolve('Table drafts created successfully.');
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
      tx.executeSql(
        'ALTER TABLE drafts ADD COLUMN date TEXT;',
        [],
        () => {
          resolve('Column date added successfully.');
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
  return promise;
};
