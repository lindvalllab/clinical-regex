export const menuEntries = [
  'new-project',
  'load-project',
  'save-as',
  'export-project',
  'preferences',
] as const;

export type MenuEntry = typeof menuEntries[number];

export type MenuEntryHandler = (listener: () => void) => void;
