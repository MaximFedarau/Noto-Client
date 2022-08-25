import * as SQLite from 'expo-sqlite';

import { DraftSchema } from '@app-types/types';

const db = SQLite.openDatabase('drafts.db');

export const fetchDraftPack = (offset = 0, pattern = '') => {
  // count all items
  const promise = new Promise<{
    draftsPack: DraftSchema[];
    isEnd: boolean;
  }>((resolve, reject) => {
    let itemsCount = 0;
    db.transaction((tx) => {
      //count all items
      tx.executeSql(
        `SELECT COUNT(*) AS count FROM drafts WHERE title LIKE ? OR content LIKE ?`,
        [`%${pattern}%`, `%${pattern}%`],
        (_, result) => {
          itemsCount = result.rows._array[0].count;
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM drafts WHERE title LIKE ? OR content LIKE ? ORDER BY datetime(date) ASC LIMIT 10 OFFSET ?`,
        [`%${pattern}%`, `%${pattern}%`, offset],
        (_, result) => {
          resolve({
            draftsPack: result.rows._array,
            isEnd: result.rows._array.length + offset >= itemsCount,
          });
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
