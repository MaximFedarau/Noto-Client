import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export const addDraft = (date: string, title?: string, content?: string) => {
  const promise = new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO drafts (title, content, date) VALUES (?, ?, ?)',
        [title || '', content || '', date],
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
