import ElectronApi from '../api/electron';
import fs from 'fs';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { getKnexDb, getTempDbPath, initDb, isDbBroken } from './db';
import { URL } from 'url';
import { createMenu, disableCustomMenuItems, disableDevTools } from './menu';

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

  createMenu(mainWindow);

  if (app.isPackaged) {
    // Disable dev tools menu option if in production.
    disableDevTools();
  } else {
    // Use react developer tools.
    // "Dynamic imports" allow us to only perform the import in development.
    import('electron-devtools-installer')
      .then((installer) => installer.default(installer.REACT_DEVELOPER_TOOLS))
      .then((name) => console.log(`Added extension: ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
  mainWindow.loadURL(windowUrl);
  mainWindow.on('closed', async () => {
    mainWindow = null;
    await getKnexDb().destroy();
    const tempDbPath = await getTempDbPath();
    if (fs.existsSync(tempDbPath)) {
      fs.unlinkSync(tempDbPath);
    }
  });

  const electronApi = new ElectronApi();
  const currWindow = mainWindow;
  // Make user confirm if data will be lost on closing.
  mainWindow.on('close', async (event) => {
    event.preventDefault();
    if (
      (await electronApi.connectedToTempDb()) &&
      (await electronApi.projectStarted())
    ) {
      const choice = dialog.showMessageBoxSync(currWindow, {
        type: 'question',
        buttons: ['Cancel', 'Quit'],
        message:
          'Are you sure you want to quit? Unsaved progress will be lost.',
        defaultId: 0,
      });
      if (choice === 1) {
        currWindow.destroy();
      }
    } else currWindow.destroy();
  });
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

app.on('ready', async () => {
  createWindow();
  const tempDbPath = await getTempDbPath();
  if (mainWindow !== null && fs.existsSync(tempDbPath)) {
    if (await isDbBroken(tempDbPath)) fs.unlinkSync(tempDbPath);
    else {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Open it', 'Delete it'],
        message:
          'There is unsaved progress from a previous session. Would you like to open it?',
        defaultId: 0,
      });
      if (choice === 1) fs.unlinkSync(tempDbPath);
    }
  }
  initDb();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    disableCustomMenuItems();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    initDb();
  }
});

app.on('open-file', (event, path) => {
  event.preventDefault();

  // https://github.com/electron/electron/blob/main/docs/api/app.md#event-open-file-macos
  // It's not totally clear to me from the docs whether the 'open-file' event would be emitted on
  // Windows... if not, the following "if" block will have to be moved somewhere else
  if (process.platform.startsWith('win') && process.argv.length >= 2) {
    path = process.argv[1];
  }

  initDb(path);
});

// For interacting with the database
// See also: preload.ts

ElectronApi.initMain(ipcMain);

// extra utility handlers
ipcMain.handle('electron:userDataPath', () => {
  return app.getPath('userData');
});
