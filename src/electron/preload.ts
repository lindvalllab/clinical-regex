import { contextBridge, ipcRenderer } from 'electron';
import ElectronApi from '../api/electron';
import { handleMenuEntry } from './menu';

contextBridge.exposeInMainWorld('api', ElectronApi.initRenderer(ipcRenderer));

contextBridge.exposeInMainWorld(
  'handleMenuEntry',
  handleMenuEntry(ipcRenderer)
);
