import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';

const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, '../build/index.html')}`
  : `http://localhost:3000`;

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: !app.isPackaged,
    },
  });

  // Disable dev tools menu option if in production.
  if (app.isPackaged) {
    const menu = Menu.getApplicationMenu();
    if (app.isPackaged && menu !== null) {
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
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
