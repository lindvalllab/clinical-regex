export const REGEX_MATCH_ID = 'cr_internal_match_id';

export function createRegex(patterns: string[], exclusions: string[]): string {
  return (
    exclusions.join('|') + `|(?<${REGEX_MATCH_ID}>` + patterns.join('|') + ')'
  );
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
      match.groups[REGEX_MATCH_ID] !== undefined &&
      match.index !== undefined
    )
      yield [match.index, match[0].length];
  }
}
