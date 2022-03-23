import fs from 'fs';
import BaseApi from './base';
import {
  getKnexDb,
  getTempDbPath,
  initDb,
  AnnotationModel,
  ExclusionModel,
  PatternModel,
  MatchModel,
  TextModel,
  SettingsModel,
} from '../electron/db';
import { getRegexMatches } from '../electron/regexExclusions';
import {
  AnnotationEntity,
  CRAnnotation,
  CRLabel,
  CRText,
  DashboardEntry,
  Entry,
  PatternEntity,
  MatchEntity,
  SettingsEntity,
  TextEntity,
} from '../types';
import { dialog, IpcMain, IpcRenderer, IpcMainInvokeEvent } from 'electron';
import Papa from 'papaparse';
import { DBError, Transaction, ref } from 'objection';
import { ExportedEntry } from './types';
import { getUnique } from '../utils';
import { groupBy } from 'lodash';

interface RendererApi {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

let progress = 0;

export default class ElectronApi extends BaseApi {
  async getAllAnnotations(): Promise<AnnotationEntity[]> {
    return AnnotationModel.query();
  }

  async getAllPatterns(): Promise<PatternEntity[]> {
    return PatternModel.query();
  }

  async getAllExclusions(): Promise<PatternEntity[]> {
    return ExclusionModel.query();
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
    else if (results.length === 0) throw Error('No settings found.');

    const settings = results[0];

    // sqlite doesn't have a bool type
    settings.IS_GROUPED = Boolean(Number(settings.IS_GROUPED));

    return settings;
  }

  async getNumAnnotated(): Promise<number> {
    const results = await AnnotationModel.query();

    const groupIds = getUnique(results.map((item) => item.group_id));

    return groupIds.length;
  }

  async getNumAnnotatedWithMatches(): Promise<number> {
    const results = await MatchModel.query().withGraphFetched({
      text: {
        annotations: true,
      },
    });

    const groupIds = getUnique(
      results
        .filter((item) => item.text.annotations.length > 0)
        .map((item) => item.text.group_id)
    );

    return groupIds.length;
  }

  async getTotalEntriesWithMatches(): Promise<number> {
    const results = await MatchModel.query().withGraphFetched({
      text: true,
    });

    const groupIds = getUnique(results.map((item) => item.text.group_id));

    return groupIds.length;
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
      await PatternModel.query(trx).insert({
        label: label.name,
        pattern: pattern,
      });
    }
    for (const pattern of label.exclusions) {
      await ExclusionModel.query(trx).insert({
        label: label.name,
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
    await PatternModel.transaction(async (trx) => {
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

  async getAllGroupIds({
    orderByMatches = false,
  }: {
    orderByMatches: boolean;
  }): Promise<string[]> {
    if (orderByMatches) {
      // order groupIds by number of matches among their texts
      return TextModel.query()
        .select('texts.group_id')
        .count('matches.id', { as: 'num_matches' })
        .leftJoinRelated('matches')
        .groupBy('texts.group_id')
        .orderBy('num_matches', 'desc')
        .then((results) => results.map((item) => item.group_id));
    } else {
      const groupIds = await TextModel.query()
        .distinct('group_id')
        .orderBy('group_id', 'desc');

      return groupIds.map((model) => model.group_id);
    }
  }

  async getDashboardTable(
    page: number,
    pageSize: number
  ): Promise<{ results: DashboardEntry[]; total: number }> {
    const textPage = await TextModel.query()
      .select('texts.*')
      .count('matches.id', { as: 'num_matches' })
      .leftJoinRelated('matches')
      .groupBy('texts.group_id')
      .orderBy('num_matches', 'desc')
      .page(page, pageSize);

    const dashboardPage = await Promise.all(
      textPage.results.map(async (text) => ({
        group_id: text.group_id,
        labels: await this.getMatchedLabelsByGroupId(text.group_id),
        num_matches: text.num_matches,
        is_annotated:
          (
            await AnnotationModel.query().where('group_id', text.group_id)
          ).length > 0,
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
    if (await this.connectedToTempDb()) await getKnexDb().destroy();
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
  }

  async projectStarted(): Promise<boolean> {
    try {
      return (await SettingsModel.query()).length > 0;
    } catch (error) {
      if (error instanceof DBError) {
        return false;
      } else {
        throw error;
      }
    }
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
    await getKnexDb().destroy();
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

  async exportConfig(): Promise<string | undefined> {
    const destination = dialog.showSaveDialogSync({
      title: 'Export Config File As',
      defaultPath: 'Untitled.json',
      filters: [
        {
          name: 'JavaScript Object Notation',
          extensions: ['json'],
        },
      ],
    });

    if (destination) {
      const settings = await this.getSettings();
      const labels = await this.collectLabels();

      const config = {
        isGrouped: settings.IS_GROUPED,
        groupIdField: settings.GROUP_ID_FIELD,
        textField: settings.TEXT_ID_FIELD,
        labels: labels,
      };

      fs.writeFileSync(destination, JSON.stringify(config, null, 2));

      return destination;
    } else {
      // TO-DO: figure out a better way to handle this.
      console.error(`Destination ${destination} not valid.`);
      return;
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
      const labels = await this.getAllPatterns()
        .then((patterns) => patterns.map((pattern) => pattern.label))
        .then(getUnique);

      const annotations = await TextModel.query()
        .select('texts.group_id')
        .distinct('texts.group_id')
        .withGraphFetched('annotations')
        .orderBy('texts.group_id')
        .then((results) => {
          return results
            .map((entry) => {
              if (entry.annotations.length === 0) {
                return labels.map((label) => [
                  entry.group_id,
                  label,
                  undefined,
                ]);
              } else {
                return entry.annotations.map((annotation) => [
                  entry.group_id,
                  annotation.label,
                  annotation.value,
                ]);
              }
            })
            .flat(1);
        });

      const settings = await this.getSettings();
      const groupIdField =
        settings.GROUP_ID_FIELD !== null ? settings.GROUP_ID_FIELD : 'id';
      const csv = Papa.unparse({
        fields: [groupIdField, 'label', 'value'],
        data: annotations,
      });
      fs.writeFileSync(destination, csv);
      return destination;
    } else {
      // TO-DO: figure out a better way to handle this.
      console.error(`Destination ${destination} not valid.`);
      return;
    }
  }

  async collectLabels(): Promise<CRLabel[]> {
    const labels: CRLabel[] = await this.getAllPatterns()
      .then((patterns) => groupBy(patterns, (e) => e.label))
      .then((grouped) =>
        Object.entries(grouped).map(([key, value], _index) => ({
          name: key,
          patterns: value.map((label) => label.pattern),
          exclusions: [],
        }))
      );

    const exclusions = await this.getAllExclusions().then((exclusions) =>
      groupBy(exclusions, (e) => e.label)
    );

    for (let i = 0; i < labels.length; ++i) {
      labels[i].exclusions =
        labels[i].name in exclusions
          ? exclusions[labels[i].name].map((entity) => entity.pattern)
          : [];
    }
    return labels;
  }

  async findRegexMatches(): Promise<void> {
    const labels = await this.collectLabels();
    const promises: Promise<void>[] = [];
    const numberOfTexts = await TextModel.query().resultSize();
    progress = 0;
    await MatchModel.transaction(async (trx) => {
      for (let text_id = 1; text_id <= numberOfTexts; text_id++) {
        const textEntity = await TextModel.query(trx).findById(text_id);
        for (const label of labels) {
          for (const match of getRegexMatches(
            label.patterns,
            label.exclusions,
            textEntity.text
          )) {
            promises.push(
              new Promise(async (resolve) => {
                await MatchModel.query(trx).insert({
                  text_id: text_id,
                  label: label.name,
                  start: match.index,
                  length: match.length,
                });
                resolve();
              })
            );
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
