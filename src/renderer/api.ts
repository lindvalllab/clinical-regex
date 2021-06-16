import React from 'react';
import BaseApi from '../api/base';
import ElectronApi from '../api/electron';
import { MenuEntry, MenuEntryHandler } from '../menu';

declare global {
  interface Window {
    api: ElectronApi;
    handleMenuEntry: { [entry in MenuEntry]: MenuEntryHandler };
  }
}

export const ApiContext = React.createContext<BaseApi>(window.api);
