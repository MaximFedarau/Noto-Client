import { Record } from './record';

export interface SocketNote {
  status: SocketNoteStatus;
  note: Record;
  isDeleteOrigin?: boolean; // flag for delete handler, which means that answers the question: Does note was deleted from current device?
}

export enum SocketErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED,
}

export enum SocketNoteStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
