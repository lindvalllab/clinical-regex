import { Entity, Entry } from 'types';

interface ApiType {
  getById: (tableName: string, id: number) => Promise<Entity | undefined>;
  getEntry: (groupId: string) => Entry;
}

declare global {
  interface Window {
    api: ApiType;
  }
}

export const api = window.api;
