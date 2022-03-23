import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  DashboardEntry,
  Entry,
  LabelEntity,
  MatchEntity,
  SettingsEntity,
  TextEntity,
} from '../types';

export default abstract class BaseApi {
  public abstract getAllAnnotations(): Promise<AnnotationEntity[]>;
  public abstract getAllPatterns(): Promise<LabelEntity[]>;
  public abstract getAllTexts(): Promise<TextEntity[]>;
  public abstract getAllMatches(): Promise<MatchEntity[]>;
  public abstract getAllGroupIds(opts: {
    orderByMatches: boolean;
  }): Promise<string[]>;
  public abstract getMatchesByTextId(text_id: number): Promise<MatchEntity[]>;
  public abstract getSettings(): Promise<SettingsEntity>;
  public abstract getNumAnnotated(): Promise<number>;
  public abstract getNumAnnotatedWithMatches(): Promise<number>;
  public abstract getTotalEntriesWithMatches(): Promise<number>;
  public abstract getEntry(groupId: string): Promise<Entry>;
  public abstract getDashboardTable(
    page: number,
    pageSize: number
  ): Promise<{ results: DashboardEntry[]; total: number }>;
  public abstract connectedToTempDb(): Promise<boolean>;
  public abstract deleteTempDb(): Promise<void>;
  public abstract projectStarted(): Promise<boolean>;
  public abstract saveDbAs(): Promise<string | undefined>;
  public abstract loadDb(): Promise<string | undefined>;
  public abstract loadDbFromPath(source?: string): Promise<void>;
  public abstract insertAnnotation(text: CRAnnotation): Promise<void>;
  public abstract insertLabel(text: CRLabel): Promise<void>;
  public abstract insertText(text: CRText): Promise<void>;
  public abstract updateAnnotation(annotation: CRAnnotation): Promise<void>;
  public abstract exportConfig(): Promise<string | undefined>;
  public abstract exportAnnotations(): Promise<string | undefined>;
  public abstract findRegexMatches(): Promise<void>;
  public abstract exportMatches(): Promise<string | undefined>;
  public abstract insertSettings(
    isGrouped: boolean,
    groupIdField: string | null,
    textIdField: string
  ): Promise<void>;
  public abstract loadCsv(
    path: string,
    size: number,
    idColIndex: number,
    textColIndex: number
  ): Promise<void>;
  public abstract getProgress(): Promise<number>;
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
  public async updateAnnotations(annotations: CRAnnotation[]): Promise<void> {
    for (const annotation of annotations) {
      await this.updateAnnotation(annotation);
    }
  }
}
