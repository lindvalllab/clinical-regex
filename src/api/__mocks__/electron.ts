import { CRText, Entry, TextEntity } from '../../types';

export default class ElectronApi {
  texts = [
    { id: 0, group_id: '0123', text: 'hello' },
    { id: 1, group_id: '1345', text: 'lorem' },
    { id: 2, group_id: '0123', text: 'ipsum' },
  ];
  async getAllTexts(): Promise<TextEntity[]> {
    return new Promise(() => this.texts);
  }
  async getAllGroupIds(): Promise<string[]> {
    return new Promise(() => ['0123', '1234']);
  }
  async getEntry(groupId: string): Promise<Entry> {
    if (groupId === '0123') {
      return new Promise(() => ({
        texts: [
          { id: 0, group_id: '0123', text: 'hello' },
          { id: 2, group_id: '0123', text: 'ipsum' },
        ],
        annotations: [],
      }));
    } else if (groupId === '1345') {
      return new Promise(() => ({
        texts: [{ id: 1, group_id: '1345', text: 'lorem' }],
        annotations: [],
      }));
    }
    return {
      texts: [],
      annotations: [],
    };
  }
  async insertText(_text: CRText): Promise<void> {
    return new Promise(() => undefined);
  }
}
