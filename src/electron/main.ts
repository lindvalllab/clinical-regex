import ElectronApi from '../api/electron';
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { initDb } from './db';

const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, '../index.html')}`
  : `http://localhost:3000`;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      devTools: !app.isPackaged, // only allow dev tools in development
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      enableRemoteModule: false,
    },
  });

  if (app.isPackaged) {
    // Disable dev tools menu option if in production.
    const menu = Menu.getApplicationMenu();
    if (menu !== null) {
      // Find View menu.
      // Typescript expects the role to be 'viewMenu', but in reality it is 'viewmenu'.
      // Convert to lowercase to resolve ambiguity.
      const viewMenu = menu.items.find(
        (item) =>
          item.role !== undefined && item.role.toLowerCase() === 'viewmenu'
      );
      if (viewMenu !== undefined && viewMenu.submenu !== undefined) {
        // Find 'Toggle Dev Tools' menu item and disable it.
        const toggleDevTools = viewMenu.submenu.items.find(
          (item) =>
            item.role !== undefined &&
            item.role.toLowerCase() === 'toggledevtools'
        );
        if (toggleDevTools !== undefined) {
          toggleDevTools.enabled = false;
          toggleDevTools.visible = false;
        }
      }
    }
  } else {
    // Use react developer tools.
    // "Dynamic imports" allow us to only perform the import in development.
    import('electron-devtools-installer')
      .then((installer) => installer.default(installer.REACT_DEVELOPER_TOOLS))
      .then((name) => console.log(`Added extension: ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
  mainWindow.loadURL(windowUrl);
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();
  initDb();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// For interacting with the database
// See also: preload.ts

ElectronApi.initMain(ipcMain);

// extra utility handlers
ipcMain.handle('electron:userDataPath', () => {
  return app.getPath('userData');
});
