import { getRegexMatches } from './regexExclusions';

test('Exclusions handled', () => {
  // This should match "GOC" and the first occurrence of "Goals of care",
  // but the second occurrence should be excluded.
  // The first match should be at index 0 with length 3,
  // the second match should be at index 14 with length 13
  const matches = getRegexMatches(
    ['GOC', 'goals of care'],
    ['(goals of care|goc) not discussed'],
    'GOC: Although Goals of care are important, Goals of Care not discussed'
  );
  const expected = [
    { index: 0, length: 3 },
    { index: 14, length: 13 },
  ];
  expect(Array.from(matches)).toEqual(expected);
});

test('Works with no exclusions', () => {
  // This should match "GOC" and the both occurrences of goals of care.
  const matches = getRegexMatches(
    ['GOC', 'goals of care'],
    [],
    'GOC: Although Goals of care are important, Goals of Care not discussed'
  );
  const expected = [
    { index: 0, length: 3 },
    { index: 14, length: 13 },
    { index: 43, length: 13 },
  ];
  expect(Array.from(matches)).toEqual(expected);
});
