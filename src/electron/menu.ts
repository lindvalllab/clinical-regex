import { BrowserWindow, Menu, MenuItem } from 'electron';

export function createMenu(mainWindow: BrowserWindow): void {
  const menu = Menu.getApplicationMenu();
  if (menu === null) return;

  const fileMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'filemenu'
  );
  const newProject = new MenuItem({
    label: 'New Project',
    accelerator: 'CmdOrCtrl+n',
    click: () => mainWindow.webContents.send('new-project'),
  });
  const loadProject = new MenuItem({
    label: 'Load Project...',
    accelerator: 'CmdOrCtrl+o',
    click: () => mainWindow.webContents.send('load-project'),
  });
  const saveAs = new MenuItem({
    label: 'Save As...',
    accelerator: 'CmdOrCtrl+Shift+s',
    click: () => mainWindow.webContents.send('save-as'),
  });
  const exportProject = new MenuItem({
    label: 'Export Project...',
    accelerator: 'CmdOrCtrl+e',
    click: () => mainWindow.webContents.send('export-project'),
  });
  const separator = new MenuItem({
    type: 'separator',
  });

  // On macOS, we might have menu items that were created the last time the window was opened.
  // However, the 'click' handlers will be associated to the old window, which has been destroyed.
  // So if the menu items already exist, we need to update their 'click' properties.
  const fileMenuEntries = [newProject, loadProject, saveAs, exportProject];
  if (fileMenu !== undefined && fileMenu.submenu !== undefined) {
    let inserted = false; // Did we insert new entries in the file menu?
    for (const i in fileMenuEntries) {
      const foundEntry = fileMenu.submenu.items.find(
        (item) => item.label === fileMenuEntries[i].label
      );
      if (foundEntry !== undefined) {
        foundEntry.click = fileMenuEntries[i].click;
      } else {
        fileMenu.submenu.insert(Number(i), fileMenuEntries[i]);
        inserted = true;
      }
    }
    if (inserted) fileMenu.submenu.insert(4, separator);
  }

  const editMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'editmenu'
  );
  const preferences = new MenuItem({
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click: () => mainWindow.webContents.send('preferences'),
  });
  if (editMenu !== undefined && editMenu.submenu !== undefined) {
    const foundPreferences = editMenu.submenu.items.find(
      (item) => item.label === preferences.label
    );
    if (foundPreferences !== undefined) {
      foundPreferences.click = preferences.click;
    } else {
      editMenu.submenu.append(separator);
      editMenu.submenu.append(preferences);
    }
  }

  Menu.setApplicationMenu(menu);
}

export function disableDevTools(): void {
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
