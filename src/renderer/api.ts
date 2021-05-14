import React from 'react';
import BaseApi from '../api/base';
import ElectronApi from '../api/electron';

declare global {
  interface Window {
    api: ElectronApi;
  }
}

export const ApiContext = React.createContext<BaseApi>(window.api);
export const api: BaseApi = window.api;
