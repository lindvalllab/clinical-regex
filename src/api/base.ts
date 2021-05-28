import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  Entry,
  LabelEntity,
  TextEntity,
} from '../types';

export default abstract class BaseApi {
  public abstract getAllAnnotations(): Promise<AnnotationEntity[]>;
  public abstract getAllLabels(): Promise<LabelEntity[]>;
  public abstract getAllTexts(): Promise<TextEntity[]>;
  public abstract getAllGroupIds(): Promise<string[]>;
  public abstract getEntry(groupId: string): Promise<Entry>;
  public abstract clearDb(): Promise<void>;
  public abstract saveDb(): Promise<string | undefined>;
  public abstract insertAnnotation(text: CRAnnotation): Promise<void>;
  public abstract insertLabel(text: CRLabel): Promise<void>;
  public abstract insertText(text: CRText): Promise<void>;
  public abstract loadCsv(
    path: string,
    idColIndex: number,
    textColIndex: number
  ): Promise<void>;
  public async insertAnnotations(annotations: CRAnnotation[]): Promise<void> {
    for (const annotation of annotations) {
      await this.insertAnnotation(annotation);
    }
  }
  public async insertLabels(labels: CRLabel[]): Promise<void> {
    for (const label of labels) {
      await this.insertLabel(label);
    }
  }
  public async insertTexts(texts: CRText[]): Promise<void> {
    for (const text of texts) {
      await this.insertText(text);
    }
  }
}
