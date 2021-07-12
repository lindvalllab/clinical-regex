import { BrowserWindow, IpcRenderer, Menu, MenuItem } from 'electron';
import { menuEntries, MenuEntry, MenuEntryHandler } from '../menu';

interface MenuItemSpec {
  label: string;
  accelerator: string;
  webContentsChannel: MenuEntry;
}

const fileMenuEntrySpecs: MenuItemSpec[] = [
  {
    label: 'New Project',
    accelerator: 'CmdOrCtrl+n',
    webContentsChannel: menuEntries.NEW_PROJECT,
  },
  {
    label: 'Load Project...',
    accelerator: 'CmdOrCtrl+o',
    webContentsChannel: menuEntries.LOAD_PROJECT,
  },
  {
    label: 'Save As...',
    accelerator: 'CmdOrCtrl+Shift+s',
    webContentsChannel: menuEntries.SAVE_AS,
  },
  {
    label: 'Export Annotations...',
    accelerator: 'CmdOrCtrl+e',
    webContentsChannel: menuEntries.EXPORT_ANNOTATIONS,
  },
];

const editMenuEntrySpecs: MenuItemSpec[] = [
  {
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    webContentsChannel: menuEntries.PREFERENCES,
  },
];

export function createMenu(mainWindow: BrowserWindow): void {
  // Add custom menu items. If adding something here, remember to set the ability
  // to disable it in the disableCustomMenuItems function below.
  const menu = Menu.getApplicationMenu();
  if (menu === null) return;

  const fileMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'filemenu'
  );
  const separator = new MenuItem({
    type: 'separator',
  });
  const fileMenuEntries = fileMenuEntrySpecs.map(
    (spec) =>
      new MenuItem({
        label: spec.label,
        accelerator: spec.accelerator,
        click: () => mainWindow.webContents.send(spec.webContentsChannel),
      })
  );

  // On macOS, we might have menu items that were created the last time the window was opened.
  // However, the 'click' handlers will be associated to the old window, which has been destroyed.
  // So if the menu items already exist, we need to update their 'click' properties.
  // These menu items have also been disabled, so we need to set them to be enabled.
  if (fileMenu !== undefined && fileMenu.submenu !== undefined) {
    let inserted = false; // Did we insert new entries in the file menu?
    for (const i in fileMenuEntries) {
      const foundEntry = fileMenu.submenu.items.find(
        (item) => item.label === fileMenuEntries[i].label
      );
      if (foundEntry !== undefined) {
        foundEntry.click = fileMenuEntries[i].click;
        foundEntry.enabled = true;
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
  const editMenuEntries = editMenuEntrySpecs.map(
    (spec) =>
      new MenuItem({
        label: spec.label,
        accelerator: spec.accelerator,
        click: () => mainWindow.webContents.send(spec.webContentsChannel),
      })
  );
  if (editMenuEntries.length !== 1) {
    // Code below assumes the list only contains one entry.
    throw Error('Please ensure that the edit menu is handled properly.');
  }

  const preferences = editMenuEntries[0];
  if (editMenu !== undefined && editMenu.submenu !== undefined) {
    const foundPreferences = editMenu.submenu.items.find(
      (item) => item.label === preferences.label
    );
    if (foundPreferences !== undefined) {
      foundPreferences.click = preferences.click;
      foundPreferences.enabled = true;
    } else {
      editMenu.submenu.append(separator);
      editMenu.submenu.append(preferences);
    }
  }

  Menu.setApplicationMenu(menu);
}

export function disableCustomMenuItems(): void {
  const menu = Menu.getApplicationMenu();
  if (menu === null) return;
  const fileMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'filemenu'
  );
  if (fileMenu !== undefined && fileMenu.submenu !== undefined) {
    for (const fileMenuEntrySpec of fileMenuEntrySpecs) {
      const foundEntry = fileMenu.submenu.items.find(
        (item) => item.label === fileMenuEntrySpec.label
      );
      if (foundEntry !== undefined) {
        foundEntry.enabled = false;
      }
    }
  }

  const editMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'editmenu'
  );
  if (editMenu !== undefined && editMenu.submenu !== undefined) {
    for (const editMenuEntrySpec of editMenuEntrySpecs) {
      const foundEntry = editMenu.submenu.items.find(
        (item) => item.label === editMenuEntrySpec.label
      );
      if (foundEntry !== undefined) {
        foundEntry.enabled = false;
      }
    }
  }
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

// Handle the application menu.
// 'entry' below should be typed as MenuEntry, but typescript won't understand.
export function handleMenuEntry(ipcRenderer: IpcRenderer): {
  [entry: string]: MenuEntryHandler;
} {
  return Object.fromEntries(
    Object.values(menuEntries).map((entry) => [
      entry,
      (listener) => {
        ipcRenderer.removeAllListeners(entry);
        ipcRenderer.on(entry, listener);
      },
    ])
  );
}
