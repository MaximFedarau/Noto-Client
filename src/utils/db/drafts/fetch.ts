import { openDatabase } from 'expo-sqlite';

import { Record } from '@types';

const db = openDatabase('drafts.db');

const LIMIT = 10;

export const fetchDraftPack = (cursor?: string, pattern = '') => {
  // count all items
  const promise = new Promise<{
    draftsPack: Record[];
    isEnd: boolean;
  }>((resolve, reject) => {
    let itemsCount = 0;

    const { sqlStatement, args } = {
      sqlStatement: cursor
        ? `WHERE CAST(strftime('%s', date)  AS  integer) < CAST(strftime('%s', ?)  AS  integer) AND (title LIKE ? OR content LIKE ?)`
        : `WHERE title LIKE ? OR content LIKE ?`,
      args: cursor
        ? [cursor, `%${pattern}%`, `%${pattern}%`]
        : [`%${pattern}%`, `%${pattern}%`],
    };

    db.transaction((tx) => {
      //count all items
      tx.executeSql(
        `SELECT COUNT(*) AS count FROM drafts ${sqlStatement}`,
        args,
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
        `SELECT * FROM drafts ${sqlStatement} ORDER BY datetime(date) DESC LIMIT ${LIMIT}`,
        args,
        (_, result) => {
          resolve({
            draftsPack: result.rows._array,
            isEnd: itemsCount <= LIMIT,
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
  const promise = new Promise<Record>((resolve, reject) => {
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
