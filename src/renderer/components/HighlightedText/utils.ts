import tinycolor from 'tinycolor2';
import { SpanWithTags } from '../../../types';
import { MIN_CONTEXT_WINDOW_SIZE } from './constants';

export const getColor = (
  tags: string[],
  palette: Record<string, string>
): string | undefined => {
  if (tags.length === 0) {
    return undefined;
  }

  const colors = tags.map((tag: string) => {
    const color = palette[tag] ? palette[tag] : null;
    return tinycolor(color || 'transparent');
  });

  if (colors.length === 1) {
    return colors[0].toHexString();
  } else if (colors.length > 1) {
    const color = colors.reduce((accumulated, current) =>
      tinycolor.mix(accumulated, current, 100 / colors.length)
    );
    return color.toHexString();
  }

  return undefined;
};

export const getUnique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const getTooltip = (span: SpanWithTags): string => {
  return span.tags.join(', ');
};

export const isValidContextWindowValue = (value: number): boolean =>
  value >= MIN_CONTEXT_WINDOW_SIZE;
