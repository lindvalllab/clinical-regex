import { contextBridge, ipcRenderer } from 'electron';
import { CRText } from '../types';

contextBridge.exposeInMainWorld('api', {
  getById: (tableName: string, id: number) =>
    ipcRenderer.invoke('getById', tableName, id),
  getEntry: (groupId: string) => ipcRenderer.invoke('getEntry', groupId),
  insertTexts: (texts: CRText[]) => ipcRenderer.invoke('insertTexts', texts),
});
