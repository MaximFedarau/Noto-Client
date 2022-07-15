//Expo
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export function updateDraft(id: string, title: string, content?: string) {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE drafts SET title = ?, content = ? WHERE id = ?',
        [title, content!, id],
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
}
