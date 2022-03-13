import { createRegex, getMatches } from './regexExclusions';

test('abc', () => {
  console.log(
    createRegex(['GOC', 'goals of care'], ['goals of care not discussed'])
  );
});

test('def', () => {
  for (const x of getMatches(
    createRegex(
      ['GOC', 'goals of care'],
      ['(goals of care|goc) not discussed']
    ),
    'GOC: Although Goals of care are important, Goals of Care not discussed'
  )) {
    console.log(x);
  }
});
