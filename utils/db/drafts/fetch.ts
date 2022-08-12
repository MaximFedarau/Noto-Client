import * as SQLite from 'expo-sqlite';

import { DraftSchema } from '@app-types/types';

const db = SQLite.openDatabase('drafts.db');

export const fetchDrafts = () => {
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
};

export const fetchDraftById = (id: string) => {
  const promise = new Promise<DraftSchema>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM drafts WHERE id = ?',
        [id],
        (_, result) => {
          resolve(result.rows._array[0]);
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
