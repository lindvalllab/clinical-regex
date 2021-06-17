export const menuEntries = {
  NEW_PROJECT: 'new-project',
  LOAD_PROJECT: 'load-project',
  SAVE_AS: 'save-as',
  EXPORT_PROJECT: 'export-project',
  PREFERENCES: 'preferences',
} as const;
export type MenuEntry = typeof menuEntries[keyof typeof menuEntries];

export type MenuEntryHandler = (listener: () => void) => void;
