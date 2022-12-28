import { openDatabase } from 'expo-sqlite';

const db = openDatabase('drafts.db');

export const deleteDraftById = (id: string) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM drafts WHERE id=?',
        [id],
        (_, result) => {
          resolve(result);
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
