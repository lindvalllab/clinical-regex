import fs from 'fs';
import BaseApi from './base';
import {
  getKnexDb,
  getTempDbPath,
  initDb,
  AnnotationModel,
  LabelModel,
  MatchModel,
  TextModel,
  SettingsModel,
} from '../electron/db';
import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  DashboardEntry,
  Entry,
  LabelEntity,
  MatchEntity,
  SettingsEntity,
  TextEntity,
} from '../types';
import { dialog, IpcMain, IpcRenderer, IpcMainInvokeEvent } from 'electron';
import Papa from 'papaparse';
import { Transaction, ref } from 'objection';
import { ExportedEntry } from './types';

interface RendererApi {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

let progress = 0;

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
  async getAllMatches(): Promise<MatchEntity[]> {
    return MatchModel.query();
  }
  async getMatchesByTextId(text_id: number): Promise<MatchEntity[]> {
    return MatchModel.query().where('text_id', text_id);
  }
  async getEntry(groupId: string): Promise<Entry> {
    const texts = await TextModel.query().where({ group_id: groupId });
    const annotations = await AnnotationModel.query().where({
      group_id: groupId,
    });

    return {
      groupId: groupId,
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
  async updateAnnotation(
    annotation: CRAnnotation,
    trx?: Transaction
  ): Promise<void> {
    const existing = AnnotationModel.query(trx)
      .where('group_id', annotation.group_id)
      .where('label', annotation.label);
    if ((await existing).length > 0) await existing.update(annotation);
    else await this.insertAnnotation(annotation, trx);
  }
  async updateAnnotations(annotations: CRAnnotation[]): Promise<void> {
    await AnnotationModel.transaction(async (trx) => {
      for (const annotation of annotations) {
        await this.updateAnnotation(annotation, trx);
      }
    });
  }
  async getAllGroupIds(): Promise<string[]> {
    const groupIds = await TextModel.query()
      .distinct('group_id')
      .orderBy('group_id');

    return groupIds.map((model) => model.group_id);
  }
  async getDashboardTable(
    page: number,
    pageSize: number
  ): Promise<{ results: DashboardEntry[]; total: number }> {
    const textPage = await TextModel.query()
      .groupBy('group_id')
      .page(page, pageSize);
    const dashboardPage = await Promise.all(
      textPage.results.map(async (text) => ({
        group_id: text.group_id,
        text: text.text,
        labels: await this.getMatchedLabelsByGroupId(text.group_id),
      }))
    );
    return {
      results: dashboardPage,
      total: textPage.total,
    };
  }
  async getMatchedLabelsByGroupId(groupId: string): Promise<string[]> {
    // TODO: can this be done using objection directly?
    const matches = TextModel.knex()('texts')
      .where('group_id', groupId)
      .join('matches', 'matches.text_id', 'texts.id')
      .select('texts.id', 'group_id', 'label')
      .groupBy('label');
    return (await matches).map((match: Record<string, string>) => match.label);
  }
  async connectedToTempDb(): Promise<boolean> {
    const tempDbPath = await getTempDbPath();
    const currDbPath = (await getKnexDb().client.config.connection()).filename;
    return currDbPath === tempDbPath;
  }
  async deleteTempDb(): Promise<void> {
    const tempDbPath = await getTempDbPath();
    if (await this.connectedToTempDb()) getKnexDb().destroy();
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
  }
  async projectStarted(): Promise<boolean> {
    return (await SettingsModel.query()).length > 0;
  }

  async saveDbAs(): Promise<string | undefined> {
    const destination = dialog.showSaveDialogSync({
      title: 'Save File As',
      defaultPath: 'Untitled.cr',
      filters: [
        {
          name: 'Clinical Regex File',
          extensions: ['cr'], // TO-DO: decide on actual extension
        },
      ],
    });

    if (destination) {
      const source = (await getKnexDb().client.config.connection()).filename;
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
    getKnexDb().destroy();
    await initDb(source);
  }

  async loadDb(): Promise<string | undefined> {
    const source = dialog.showOpenDialogSync({
      title: 'Load File',
      filters: [
        {
          name: 'Clinical Regex File',
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
    size: number,
    idColIndex: number,
    textColIndex: number
  ): Promise<void> {
    progress = 0;
    try {
      const csv = fs.createReadStream(path);
      const promises: Promise<void>[] = [];
      await TextModel.transaction(async (trx) => {
        let isHeaderRow = true;
        const parseLine = async (result: Papa.ParseResult<string>) => {
          // Skip header row.
          if (!isHeaderRow) {
            progress = (100 * result.meta.cursor) / size;
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

  async exportAnnotations(): Promise<string | undefined> {
    const destination = dialog.showSaveDialogSync({
      title: 'Export File As',
      defaultPath: 'Untitled.csv',
      filters: [
        {
          name: 'Comma-separated values',
          extensions: ['csv'],
        },
      ],
    });

    if (destination) {
      const annotations = await this.getAllAnnotations();
      const settings = await this.getSettings();
      const groupIdField =
        settings.GROUP_ID_FIELD !== null ? settings.GROUP_ID_FIELD : 'id';
      const csv = Papa.unparse({
        fields: [groupIdField, 'label', 'value'],
        data: annotations.map((annotation) => [
          annotation.group_id,
          annotation.label,
          annotation.value,
        ]),
      });
      fs.writeFileSync(destination, csv);
      return destination;
    } else {
      // TO-DO: figure out a better way to handle this.
      console.error(`Destination ${destination} not valid.`);
      return;
    }
  }

  async findRegexMatches(): Promise<void> {
    const labels = await this.getAllLabels();
    const promises: Promise<void>[] = [];
    const numberOfTexts = await TextModel.query().resultSize();
    progress = 0;
    await MatchModel.transaction(async (trx) => {
      for (let text_id = 1; text_id <= numberOfTexts; text_id++) {
        const textEntity = await TextModel.query(trx).findById(text_id);
        for (const label of labels) {
          const re = new RegExp(label.pattern, 'gi');
          for (const match of Array.from(textEntity.text.matchAll(re))) {
            if (match.index !== undefined) {
              promises.push(
                new Promise(async (resolve) => {
                  await MatchModel.query(trx).insert({
                    text_id: text_id,
                    label: label.name,
                    start: match.index,
                    length: match[0].length,
                  });
                  resolve();
                })
              );
            }
          }
        }
        progress = 100 * (text_id / numberOfTexts);
      }
      await Promise.all(promises);
    });
  }

  async exportMatches(): Promise<string | undefined> {
    progress = 0;
    const destination = dialog.showSaveDialogSync({
      title: 'Export File As',
      defaultPath: 'Untitled.json',
      filters: [
        {
          name: 'JSON file',
          extensions: ['json'],
        },
      ],
    });

    if (destination) {
      // TODO: can this be done with just objection?
      const db = TextModel.knex();
      const matches = await db('texts')
        .join('matches', 'matches.text_id', 'texts.id')
        .select(
          'group_id',
          'text_id',
          'label',
          'start',
          'length',
          db.raw('substr(text, start + 1, length) as text')
        )
        .orderBy('group_id')
        .orderBy('text_id')
        .orderBy('label')
        .orderBy('start');

      // The output will look a little weird when not using a group ID.
      const output: ExportedEntry[] = [];
      for (const match of matches) {
        if (
          output.length === 0 ||
          output[output.length - 1].group_id !== match.group_id
        )
          output.push({
            group_id: match.group_id,
            texts: [],
          });
        const entry = output[output.length - 1];

        if (
          entry.texts.length === 0 ||
          entry.texts[entry.texts.length - 1].text_id !== match.text_id
        )
          entry.texts.push({
            text_id: match.text_id,
            labels: [],
          });
        const text = entry.texts[entry.texts.length - 1];

        if (
          text.labels.length === 0 ||
          text.labels[text.labels.length - 1].name !== match.label
        )
          text.labels.push({
            name: match.label,
            matches: [],
          });
        const label = text.labels[text.labels.length - 1];

        label.matches.push({
          start: match.start,
          length: match.length,
          text: match.text,
        });
      }
      fs.writeFileSync(destination, JSON.stringify(output, null, 2));
      return destination;
    } else {
      console.error(`Destination ${destination} not valid.`);
      return;
    }
  }
  async getProgress(): Promise<number> {
    return progress;
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
