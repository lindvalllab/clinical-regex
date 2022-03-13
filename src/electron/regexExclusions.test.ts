import { createRegex, getMatches } from './regexExclusions';

test('abc', () => {
  console.log(createRegex('ab', ['abc']));
});

test('def', () => {
  for (const x of getMatches(createRegex('b', ['ab', 'bc']), 'abbabc')) {
    console.log(x);
  }
});
