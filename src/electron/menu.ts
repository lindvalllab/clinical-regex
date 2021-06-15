import { Menu, MenuItem } from 'electron';

function createMenu(): void {
  const menu = Menu.getApplicationMenu();
  if (menu === null) return;

  const fileMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'filemenu'
  );
  const newProject = new MenuItem({
    label: 'New Project',
    accelerator: 'CmdOrCtrl+n',
    click: () => console.log('New project'),
  });
  const loadProject = new MenuItem({
    label: 'Load Project...',
    accelerator: 'CmdOrCtrl+o',
    click: () => console.log('Opening'),
  });
  const saveAs = new MenuItem({
    label: 'Save As...',
    accelerator: 'CmdOrCtrl+Shift+s',
    click: () => console.log('Saving'),
  });
  const exportProject = new MenuItem({
    label: 'Export Project...',
    accelerator: 'CmdOrCtrl+e',
    click: () => console.log('Exporting'),
  });
  const separator = new MenuItem({
    type: 'separator',
  });
  if (fileMenu !== undefined && fileMenu.submenu !== undefined) {
    fileMenu.submenu.insert(0, newProject);
    fileMenu.submenu.insert(1, loadProject);
    fileMenu.submenu.insert(2, saveAs);
    fileMenu.submenu.insert(3, exportProject);
    fileMenu.submenu.insert(4, separator);
  }

  const editMenu = menu.items.find(
    (item) => item.role !== undefined && item.role.toLowerCase() === 'editmenu'
  );
  const preferences = new MenuItem({
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+,',
    click: () => console.log('Preferences'),
  });
  if (editMenu !== undefined && editMenu.submenu !== undefined) {
    editMenu.submenu.append(separator);
    editMenu.submenu.append(preferences);
  }

  Menu.setApplicationMenu(menu);
}
export default createMenu;
