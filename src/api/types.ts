export type ExportedMatch = {
  start: number;
  length: number;
  text: string;
};

export type ExportedLabel = {
  name: string;
  matches: ExportedMatch[];
};

export type ExportedText = {
  text_id: number;
  labels: ExportedLabel[];
};

export type ExportedEntry = {
  group_id: string;
  texts: ExportedText[];
};
