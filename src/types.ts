export interface CRText {
  group_id: string;
  text: string;
}
export interface TextEntity extends CRText {
  id: number;
}
export interface CRLabel {
  name: string;
  pattern: string;
}
export interface LabelEntity extends CRLabel {
  id: number;
}
export interface CRAnnotation {
  group_id: string;
  label_id: number;
  value: number;
}
export interface AnnotationEntity extends CRAnnotation {
  id: number;
}
export type Entity = TextEntity | LabelEntity | AnnotationEntity;
export interface Entry {
  texts: TextEntity[];
  annotations: AnnotationEntity[];
}
