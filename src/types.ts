import { ModelObject } from 'objection';
import {
  AnnotationModel,
  LabelModel,
  MatchModel,
  SettingsModel,
  TextModel,
} from './electron/db';

export interface CRText {
  group_id: string;
  text: string;
}
export interface CRLabel {
  name: string;
  patterns: string[];
  exclusions: string[];
}
export interface CRAnnotation {
  group_id: string;
  label: string;
  value: number;
}
// The three types below correspond to rows in the database.
export type TextEntity = ModelObject<TextModel>;
export type LabelEntity = ModelObject<LabelModel>;
export type AnnotationEntity = ModelObject<AnnotationModel>;
export type SettingsEntity = ModelObject<SettingsModel>;
export type MatchEntity = ModelObject<MatchModel>;
export interface Entry {
  groupId: string;
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
export type DashboardEntry = {
  group_id: string;
  labels: string[];
  num_matches: number;
  is_annotated: boolean;
};
