import { contextBridge, ipcRenderer } from 'electron';
import ElectronApi from '../api/electron';
import { menuEntries, MenuEntryHandler } from '../menu';

contextBridge.exposeInMainWorld('api', ElectronApi.initRenderer(ipcRenderer));

// Handle the application menu.
// 'entry' below should be typed as MenuEntry, but typescript won't understand.
const handleMenuEntry: { [entry: string]: MenuEntryHandler } =
  Object.fromEntries(
    menuEntries.map((entry) => [
      entry,
      (listener) => {
        ipcRenderer.removeAllListeners(entry);
        ipcRenderer.on(entry, listener);
      },
    ])
  );
contextBridge.exposeInMainWorld('handleMenuEntry', handleMenuEntry);
