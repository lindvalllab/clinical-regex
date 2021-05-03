import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getById: (tableName: string, id: number) =>
    ipcRenderer.invoke('getById', tableName, id),
  getEntry: (groupId: string) => ipcRenderer.invoke('getEntry', groupId),
});
