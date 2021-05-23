import { CRText, Entry, TextEntity } from '../types';

export default abstract class BaseApi {
  public abstract getAllTexts(): Promise<TextEntity[]>;
  public abstract getAllGroupIds(): Promise<string[]>;
  public abstract getEntry(groupId: string): Promise<Entry>;
  public abstract saveDb(): Promise<string | undefined>;
  public abstract insertText(text: CRText): Promise<void>;
  public async insertTexts(texts: CRText[]): Promise<void> {
    for (const text of texts) {
      await this.insertText(text);
    }
  }
}
