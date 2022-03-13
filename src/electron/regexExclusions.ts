export function createRegex(pattern: string, exclusions: string[]): string {
  const re = new RegExp(pattern, 'i');
  const relevantExclusions = exclusions.filter(re.test, re);
  return relevantExclusions.join('|') + '|(?<result>' + pattern + ')';
}

export function* getMatches(
  pattern: string,
  text: string
): Generator<[number, number]> {
  const re = new RegExp(pattern, 'gi');
  const matches = text.matchAll(re);
  for (const match of matches) {
    if (
      match.groups !== undefined &&
      match.groups['result'] !== undefined &&
      match.index !== undefined
    )
      yield [match.index, match[0].length];
  }
}

getMatches(createRegex('b', ['ab', 'bc']), 'abbabc');
