import { CRText, Entry } from '../types';
import { TextModel } from '../electron/db';

export default abstract class BaseApi {
  public abstract getAllTexts(): Promise<TextModel[]>;
  public abstract getEntry(groupId: string): Promise<Entry>;
  public abstract getGroupIds(): Promise<string[]>;
  public abstract insertText(text: CRText): Promise<void>;
  public async insertTexts(texts: CRText[]): Promise<void> {
    for (const text of texts) {
      await this.insertText(text);
    }
  }
}
