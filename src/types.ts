import { AnnotationModel, TextModel } from './electron/db';

export interface CRText {
  group_id: string;
  text: string;
}
export interface CRLabel {
  name: string;
  pattern: string;
}
export interface CRAnnotation {
  group_id: string;
  label_id: number;
  value: number;
}
export interface Entry {
  texts: TextModel[];
  annotations: AnnotationModel[];
}
