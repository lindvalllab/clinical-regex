import { CRText, Entry } from '../types';

export default abstract class BaseApi {
  public abstract getEntry(groupId: string): Promise<Entry>;
  public abstract insertText(text: CRText): Promise<void>;
  public async insertTexts(texts: CRText[]): Promise<void> {
    for (const text of texts) {
      await this.insertText(text);
    }
  }
}
