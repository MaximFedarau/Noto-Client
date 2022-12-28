import { openDatabase } from 'expo-sqlite';

import { Record } from '@types';

const db = openDatabase('drafts.db');

export const updateDraftById = ({ id, title, content, date }: Record) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE drafts SET title = ?, content = ?, date = ? WHERE id = ?',
        [title || '', content || '', date, id],
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
