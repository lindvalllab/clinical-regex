import { contextBridge, ipcRenderer } from 'electron';

console.log('Inside preload');

contextBridge.exposeInMainWorld('api', {
  get: (args: string[]) => ipcRenderer.invoke('get', ...args),
});
