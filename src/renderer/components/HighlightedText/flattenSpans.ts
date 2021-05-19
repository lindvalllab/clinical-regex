import flatten from 'flatten-overlapping-ranges';
import { SpanWithTag, SpanWithTags } from '../../../types';

const flattenSpans = (
  text: string,
  annotatedSpans: SpanWithTag[]
): SpanWithTags[] => {
  if (
    annotatedSpans.some(
      (span: SpanWithTag) =>
        typeof span.tag !== 'string' ||
        typeof span.start !== 'number' ||
        typeof span.length !== 'number'
    )
  )
    throw new Error(`Tag must be a string.`);
  const fullRange = [null, 0, text.length];

  // flatten takes a list of [id, start, length] lists
  const toFlatten: (SpanWithTag | number | null)[][] = annotatedSpans.map(
    (span: SpanWithTag) => [span, span.start, span.length]
  );

  toFlatten.push(fullRange);

  const flattened = [...flatten(toFlatten)];
  const spans = [];

  let prevStart = 0;

  for (let i = 0; i < flattened.length; i++) {
    const start = prevStart;
    const length = flattened[i][0];
    const entities = flattened[i][1].filter(<T>(el: T): boolean => el !== null);

    const getUnique = <T>(arr: T[]) => Array.from(new Set(arr));

    const tags: string[] = getUnique(
      entities.map((span: SpanWithTag) => span.tag)
    );

    prevStart = start + length;

    if (start >= text.length) {
      break;
    }

    const prevItem = spans[spans.length - 1];

    const hasSameElements = <T>(a: T[], b: T[]) =>
      a.length === b.length && [...a].every((value) => b.includes(value));

    if (prevItem && hasSameElements(prevItem.tags, tags)) {
      prevItem.length += length;
      prevStart = prevItem.start + prevItem.length;
      prevItem.entities = prevItem.entities
        ? getUnique([...prevItem.entities, ...entities])
        : entities;
      continue;
    }

    const span: SpanWithTags = {
      start: start,
      length: length,
      tags: tags,
      entities: entities,
    };

    spans.push(span);
  }

  return spans;
};

export default flattenSpans;
