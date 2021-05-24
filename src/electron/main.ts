import ElectronApi from '../api/electron';
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { initDb } from './db';
import { URL } from 'url';

const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, '../index.html')}`
  : `http://localhost:3000`;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1200,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      devTools: !app.isPackaged, // only allow dev tools in development
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      webSecurity: true,
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

app.on('web-contents-created', (event, contents) => {
  // disable creation of new windows
  contents.setWindowOpenHandler(({ url }) => ({
    action: 'deny',
  }));

  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload;

    // Disable Node.js integration
    webPreferences.nodeIntegration = false;

    // Verify URL being loaded
    if (!params.src.startsWith(windowUrl)) {
      event.preventDefault();
    }
  });

  // only allow navigation to whitelisted origins
  contents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);

    if (parsedUrl.origin !== windowUrl) {
      event.preventDefault();
      // may want to add some kind of dev/user
      // feedback here at some point
    }
  });
});

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
