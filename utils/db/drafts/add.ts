//Expo
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export const addDraft = (title: string, content?: string) => {
  const promise = new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO drafts (title, content) VALUES (?, ?)',
        [title, content!],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
  return promise;
};
