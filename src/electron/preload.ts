import { contextBridge, ipcRenderer } from 'electron';
import ElectronApi from '../api/electron';

contextBridge.exposeInMainWorld('api', ElectronApi.initRenderer(ipcRenderer));
