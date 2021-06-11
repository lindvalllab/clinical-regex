import fs from 'fs';
import BaseApi from './base';
import {
  getDbPath,
  initDb,
  AnnotationModel,
  LabelModel,
  TextModel,
  SettingsModel,
} from '../electron/db';
import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  Entry,
  LabelEntity,
  SettingsEntity,
  TextEntity,
} from '../types';
import { dialog, IpcMain, IpcRenderer, IpcMainInvokeEvent } from 'electron';
import Papa from 'papaparse';
import { Transaction, ref } from 'objection';

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
  async getSettings(): Promise<SettingsEntity> {
    const results = await SettingsModel.query();

    if (results.length > 1)
      throw Error('Multiple settings found. Something is wrong!');

    const settings = results[0];

    // sqlite doesn't have a bool type
    settings.IS_GROUPED = Boolean(Number(settings.IS_GROUPED));

    return settings;
  }
  async insertText(
    text: Omit<CRText, 'group_id'> & Partial<CRText>,
    trx?: Transaction
  ): Promise<void> {
    if (text.group_id === undefined) {
      const dummyText = {
        // Insert a dummy group ID to be replaced by the entry ID.
        group_id: '',
        text: text.text,
      };
      const insertion = await TextModel.query(trx).insert(dummyText);
      // Replace the dummy ID by the entry ID.
      await TextModel.query(trx)
        .where('id', insertion.id)
        .update({ group_id: ref('id') });
    } else {
      await TextModel.query(trx).insert(text);
    }
  }
  async insertLabel(label: CRLabel, trx?: Transaction): Promise<void> {
    for (const pattern of label.patterns) {
      await LabelModel.query(trx).insert({
        name: label.name,
        pattern: pattern,
      });
    }
  }
  async insertSettings(
    isGrouped: boolean,
    groupIdField: string | null,
    textIdField: string,
    trx?: Transaction
  ): Promise<void> {
    if (!isGrouped && groupIdField) {
      groupIdField = null;
    }

    await SettingsModel.query(trx).insert({
      IS_GROUPED: isGrouped,
      GROUP_ID_FIELD: groupIdField,
      TEXT_ID_FIELD: textIdField,
    });
  }
  async insertAnnotation(
    annotation: CRAnnotation,
    trx?: Transaction
  ): Promise<void> {
    await AnnotationModel.query(trx).insert(annotation);
  }
  async insertTexts(texts: CRText[]): Promise<void> {
    await TextModel.transaction(async (trx) => {
      for (const text of texts) {
        await this.insertText(text, trx);
      }
    });
  }
  async insertLabels(labels: CRLabel[]): Promise<void> {
    await LabelModel.transaction(async (trx) => {
      for (const label of labels) {
        await this.insertLabel(label, trx);
      }
    });
  }
  async insertAnnotations(annotations: CRAnnotation[]): Promise<void> {
    await AnnotationModel.transaction(async (trx) => {
      for (const annotation of annotations) {
        await this.insertAnnotation(annotation, trx);
      }
    });
  }
  async getAllGroupIds(): Promise<string[]> {
    const groupIds = await TextModel.query().distinct('group_id');

    return groupIds.map((model) => model.group_id);
  }
  async getDashboardTable(
    page: number,
    pageSize: number
  ): Promise<{ results: TextEntity[]; total: number }> {
    return TextModel.query().groupBy('group_id').page(page, pageSize);
  }
  async deleteTempDb(): Promise<void> {
    const db = TextModel.knex(); // Arbitrarily get the knex object from the text model.
    const tempDbPath = await getDbPath();
    const currDbPath = (await db.client.config.connection()).filename;
    if (currDbPath === tempDbPath) db.destroy();
    fs.unlinkSync(tempDbPath);
  }

  async clearDb(): Promise<void> {
    await AnnotationModel.query().delete();
    await TextModel.query().delete();
    await LabelModel.query().delete();
    await SettingsModel.query().delete();
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
      const db = TextModel.knex(); // Arbitrarily get the knex object from the text model.
      const source = (await db.client.config.connection()).filename;
      fs.copyFileSync(source, destination);
      this.loadDbFromPath(destination);
      return destination;
    } else {
      // TO-DO: figure out a better way to handle this.
      console.error(`Destination ${destination} not valid.`);
      return;
    }
  }

  async loadDbFromPath(source?: string): Promise<void> {
    const db = TextModel.knex(); // Arbitrarily get the knex object from the text model.
    db.destroy();
    initDb(source);
  }

  async loadDb(): Promise<string | undefined> {
    const source = dialog.showOpenDialogSync({
      title: 'Load File',
      filters: [
        {
          name: 'Clinical Regex Save File',
          extensions: ['cr'], // TO-DO: decide on actual extension
        },
      ],
    });

    if (source !== undefined && source.length > 0) {
      this.loadDbFromPath(source[0]);
      return source[0];
    } else {
      console.log('No source selected');
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
      const promises: Promise<void>[] = [];
      await TextModel.transaction(async (trx) => {
        let isHeaderRow = true;
        const parseLine = async (result: Papa.ParseResult<string>) => {
          // Skip header row.
          if (!isHeaderRow) {
            promises.push(
              this.insertText(
                {
                  group_id:
                    idColIndex === -1 ? undefined : result.data[idColIndex],
                  text: result.data[textColIndex],
                },
                trx
              )
            );
          }
          isHeaderRow = false;
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
