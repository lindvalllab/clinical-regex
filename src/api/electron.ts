import fs from 'fs';
import BaseApi from './base';
import {
  getDbPath,
  AnnotationModel,
  LabelModel,
  TextModel,
} from '../electron/db';
import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  Entry,
  LabelEntity,
  TextEntity,
} from '../types';
import { dialog, IpcMain, IpcRenderer, IpcMainInvokeEvent } from 'electron';
import Papa from 'papaparse';

interface RendererApi {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export default class ElectronApi extends BaseApi {
  async getAllAnnotations(): Promise<AnnotationEntity[]> {
    return AnnotationModel.query();
  }
  async getAllLabels(): Promise<LabelEntity[]> {
    return LabelModel.query();
  }
  async getAllTexts(): Promise<TextEntity[]> {
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
    await TextModel.query().insert(text);
  }
  async insertLabel(label: CRLabel): Promise<void> {
    await LabelModel.query().insert(label);
  }
  async insertAnnotation(annotation: CRAnnotation): Promise<void> {
    await AnnotationModel.query().insert(annotation);
  }
  async getAllGroupIds(): Promise<string[]> {
    const groupIds = await TextModel.query().distinct('group_id');

    return groupIds.map((model) => model.group_id);
  }

  async clearDb(): Promise<void> {
    await AnnotationModel.query().delete();
    await TextModel.query().delete();
    await LabelModel.query().delete();
  }

  async saveDb(): Promise<string | undefined> {
    const destination = dialog.showSaveDialogSync({
      title: 'Save File',
      filters: [
        {
          name: 'Clinical Regex Save File',
          extensions: ['cr'], // TO-DO: decide on actual extension
        },
      ],
    });

    if (destination) {
      const source = await getDbPath();
      fs.copyFileSync(source, destination);
      return destination;
    } else {
      // TO-DO: figure out a better way to handle this.
      console.error(`Destination ${destination} not valid.`);
      return;
    }
  }

  async loadCsv(
    path: string,
    idColIndex: number,
    textColIndex: number
  ): Promise<void> {
    try {
      const csv = fs.createReadStream(path);
      const promises: Promise<TextEntity>[] = [];
      await TextModel.transaction(async (trx) => {
        let headers = true;
        const parseLine = async (result: Papa.ParseResult<string>) => {
          console.log(result.data[idColIndex]);
          // Skip header row.
          if (!headers) {
            promises.push(
              TextModel.query(trx).insert({
                group_id: result.data[idColIndex],
                text: result.data[textColIndex],
              })
            );
          }
          headers = false;
        };
        await new Promise<void>((resolve) =>
          Papa.parse<string>(csv, {
            step: parseLine,
            complete: async () => {
              await Promise.all(promises);
              resolve();
            },
            skipEmptyLines: true,
          })
        );
      });
    } catch (err) {
      console.log('Error completing database insert transaction');
      console.error(err);
    }
  }

  private static allMethodNames(): string[] {
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
    return Array.from(new Set(methods));
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
