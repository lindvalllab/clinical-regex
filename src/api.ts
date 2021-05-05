declare global {
  interface TextEntity {
    group_id: string;
    id: number;
    text: string;
  }
  interface AnnotationEntity {
    id: number;
    name: string;
    pattern: string;
  }
  interface LabelEntity {
    id: number;
    group_id: string;
    label_id: number;
    value: number;
  }
  type Entity = TextEntity | LabelEntity | AnnotationEntity;
  interface Entry {
    texts: TextEntity[];
    annotations: AnnotationEntity[];
  }
  interface ApiType {
    getById: (tableName: string, id: number) => Promise<Entity | undefined>;
    getEntry: (groupId: string) => Entry;
  }
  interface Window {
    api: ApiType;
  }
}

export const api = window.api;
