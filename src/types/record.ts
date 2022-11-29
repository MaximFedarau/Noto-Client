export interface RecordsManagingData {
  title?: string;
  content?: string;
}

export interface Record {
  id: string;
  date: string;
  title?: string;
  content?: string;
}

export enum FetchPackType {
  INITIAL = 'INITIAL',
  LOAD_MORE = 'LOAD_MORE',
}

export enum RecordType {
  NOTE = 'NOTE',
  DRAFT = 'DRAFT',
}
