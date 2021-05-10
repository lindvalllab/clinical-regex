export interface TextEntity {
  group_id: string;
  id: number;
  text: string;
}
export interface LabelEntity {
  id: number;
  name: string;
  pattern: string;
}
export interface AnnotationEntity {
  id: number;
  group_id: string;
  label_id: number;
  value: number;
}
export type Entity = TextEntity | LabelEntity | AnnotationEntity;
export interface Entry {
  texts: TextEntity[];
  annotations: AnnotationEntity[];
}
