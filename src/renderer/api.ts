import BaseApi from '../api/base';
import ElectronApi from '../api/electron';

declare global {
  interface Window {
    api: ElectronApi;
  }
}

export const api: BaseApi = window.api;
