import ElectronApi from '../api/electron';

declare global {
  interface Window {
    api: ElectronApi;
  }
}

export const api = window.api;
