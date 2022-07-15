//Types
import { DraftSchema } from '@app-types/types';

//Expo
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('drafts.db');

export function fetchDrafts() {
  const promise = new Promise<DraftSchema[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM drafts',
        [],
        (_, result) => {
          resolve(result.rows._array);
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
