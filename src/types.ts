import { ModelObject } from 'objection';
import { AnnotationModel, LabelModel, TextModel } from './electron/db';

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
// The three types below are like the ones above but require an ID field.
export type TextEntity = ModelObject<TextModel>;
export type LabelEntity = ModelObject<LabelModel>;
export type AnnotationEntity = ModelObject<AnnotationModel>;
export interface Entry {
  texts: TextEntity[];
  annotations: AnnotationEntity[];
}
