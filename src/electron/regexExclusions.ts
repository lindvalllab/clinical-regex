export const REGEX_MATCH_ID = 'cr_internal_match_id';

export function createRegex(patterns: string[], exclusions: string[]): string {
  const patternGroup = `(?<${REGEX_MATCH_ID}>${patterns.join('|')})`;
  return [...exclusions, patternGroup].join('|');
}

type RegexMatchData = {
  index: number;
  length: number;
};

export function* getRegexMatches(
  patterns: string[],
  exclusions: string[],
  text: string
): Generator<RegexMatchData> {
  const re = new RegExp(createRegex(patterns, exclusions), 'gi');
  const matches = text.matchAll(re);
  for (const match of matches) {
    if (
      match.groups !== undefined &&
      match.groups[REGEX_MATCH_ID] !== undefined &&
      match.index !== undefined
    )
      yield { index: match.index, length: match[0].length };
  }
}
