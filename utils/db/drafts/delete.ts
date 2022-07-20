//Expo
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export function deleteDraftById(id: string) {
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
}

export function deleteDraftIfEmpty(id: string) {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM drafts WHERE id = ? AND title = '' AND content = ''`,
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
}
