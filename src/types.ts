import { ModelObject } from 'objection';
import { AnnotationModel, LabelModel, TextModel } from './electron/db';

export interface CRText {
  group_id: string;
  text: string;
}
export interface CRLabel {
  name: string;
  patterns: string[];
}
export interface CRAnnotation {
  group_id: string;
  label_id: number;
  value: number;
}
// The three types below correspond to rows in the database.
export type TextEntity = ModelObject<TextModel>;
export type LabelEntity = ModelObject<LabelModel>;
export type AnnotationEntity = ModelObject<AnnotationModel>;
export interface Entry {
  texts: TextEntity[];
  annotations: AnnotationEntity[];
}
export interface Span {
  start: number;
  length: number;
}
export interface SpanWithTag extends Span {
  tag: string;
  tags?: never;
}
export interface SpanWithTags extends Span {
  tag?: never;
  tags: string[];
  entities?: SpanWithTag[];
}
export type AnnotatedSpan = SpanWithTag | SpanWithTags;
