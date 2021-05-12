import BaseApi from './base';
import { AnnotationModel, TextModel } from '../electron/db';
import { PartialModelObject } from 'objection';
import { CRText, Entry } from '../types';
import { IpcMain, IpcRenderer } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';

export interface RendererApi {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export class ElectronApi extends BaseApi {
  async getAllTexts(): Promise<TextModel[]> {
    return TextModel.query();
  }
  async getEntry(groupId: string): Promise<Entry> {
    const texts = await TextModel.query().where({ group_id: groupId });
    const annotations = await AnnotationModel.query().where({
      group_id: groupId,
    });

    return {
      texts: texts,
      annotations: annotations,
    };
  }
  async insertText(text: CRText): Promise<void> {
    await TextModel.query().insert(text as PartialModelObject<TextModel>);
  }

  private static allMethodNames(): ReturnType<
    typeof Object.getOwnPropertyNames
  > {
    const self = this.prototype;
    const parent = Object.getPrototypeOf(self);
    // Object.getOwnPropertyNames only returns the ones implemented in the class;
    // we need to take the union of the results on this class and on the
    // parent one
    const methods = [
      ...Object.getOwnPropertyNames(self),
      ...Object.getOwnPropertyNames(parent),
    ].filter(
      (name) =>
        name !== 'constructor' && typeof Reflect.get(self, name) === 'function'
    );
    return methods;
  }

  private static getMethod(name: string) {
    const self = this.prototype;
    const parent = Object.getPrototypeOf(self);
    const method = Reflect.get(self, name) || Reflect.get(parent, name);

    return method.bind(self);
  }

  static initMain(ipcMain: IpcMain): void {
    const names = this.allMethodNames();

    for (const name of names) {
      const method = this.getMethod(name);
      const callback = async (
        event: IpcMainInvokeEvent,
        ...args: Parameters<typeof method>
      ) => {
        console.log(`Inside handler for ${name}`);
        return method(...args);
      };
      ipcMain.handle(name, callback);
    }
  }

  static initRenderer(ipcRenderer: IpcRenderer): RendererApi {
    const names = this.allMethodNames();
    const api = {} as RendererApi;

    for (const name of names) {
      const method = this.getMethod(name);
      api[name] = (
        ...args: Parameters<typeof method>
      ): ReturnType<typeof method> => ipcRenderer.invoke(name, ...args);
    }

    return api;
  }
}
