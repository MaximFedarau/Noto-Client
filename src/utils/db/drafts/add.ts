import { SQLResultSet, openDatabase } from 'expo-sqlite';

import { Record } from '@types';

const db = openDatabase('drafts.db');

export const addDraft = ({ date, title, content }: Omit<Record, 'id'>) => {
  const promise = new Promise<SQLResultSet>((resolve, reject) => {
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
