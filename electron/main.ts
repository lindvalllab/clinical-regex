import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { db, TextModel, AnnotationModel } from './db';

const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, '../build/index.html')}`
  : `http://localhost:3000`;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: !app.isPackaged, // only allow dev tools in development
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      sandbox: true,
    },
  });

  // Disable dev tools menu option if in production.
  if (app.isPackaged) {
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
  }
  mainWindow.loadURL(windowUrl);
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.destroy();
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

ipcMain.handle('getById', async (event, tableName: string, id: number) => {
  const result = await db(tableName).where({ id: id }).first();
  return result;
});

ipcMain.handle('getEntry', async (event, groupId: string) => {
  const texts = await TextModel.query().where({ group_id: groupId });
  const annotations = await AnnotationModel.query().where({
    group_id: groupId,
  });

  return {
    texts: texts,
    annotations: annotations,
  };
});
