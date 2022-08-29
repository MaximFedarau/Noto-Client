import * as SQLite from 'expo-sqlite';

import { DraftSchema } from '@app-types/types';

const db = SQLite.openDatabase('drafts.db');

export const updateDraftById = ({ id, title, content, date }: DraftSchema) => {
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
