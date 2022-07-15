//Expo
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export function initDbDrafts() {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT)',
        [],
        () => {
          resolve('Table drafts created successfully.');
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
  // db.transaction((tx) => {
  //   tx.executeSql('DELETE FROM drafts');
  // });
  return promise;
}
