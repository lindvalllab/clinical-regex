import validationSchema from './validationSchema';
import { REGEX_MATCH_ID } from '../../../electron/regexExclusions';

test('need to have labels', () => {
  expect(validationSchema.isValidSync({ labels: [] })).toBeFalsy();
});

test('reasonable labels are OK', () => {
  expect(
    validationSchema.isValidSync({
      labels: [
        {
          name: 'good label',
          patterns: ['good', 'label'],
          exclusions: ['goods'],
        },
        {
          name: 'better label',
          patterns: ['better', 'label'],
          exclusions: ['labeled'],
        },
      ],
    })
  ).toBeTruthy();
});

test("patterns can't be empty", () => {
  expect(
    validationSchema.isValidSync({
      labels: [{ name: 'name', patterns: [], exclusions: ['abc'] }],
    })
  ).toBeFalsy();
});

test('exclusions can be empty', () => {
  expect(
    validationSchema.isValidSync({
      labels: [{ name: 'name', patterns: ['abc'], exclusions: [] }],
    })
  ).toBeTruthy();
});

test("patterns can't contain bad capture group name", () => {
  expect(() => {
    validationSchema.validateSync({
      labels: [
        { name: 'good label', patterns: ['good'], exclusions: ['bad'] },
        {
          name: 'name',
          patterns: [`(?<${REGEX_MATCH_ID}>test)`],
          exclusions: [],
        },
      ],
    });
  }).toThrow(
    `Please do not use ${REGEX_MATCH_ID} as the name of a capture group.`
  );
});

test("exclusions can't contain bad capture group name", () => {
  expect(() => {
    validationSchema.validateSync({
      labels: [
        { name: 'good label', patterns: ['good'], exclusions: ['bad'] },
        {
          name: 'name',
          patterns: ['test'],
          exclusions: [`(?<${REGEX_MATCH_ID}>test)`],
        },
      ],
    });
  }).toThrow(
    `Please do not use ${REGEX_MATCH_ID} as the name of a capture group.`
  );
});

test('patterns must be valid regular expressions', () => {
  expect(() => {
    validationSchema.validateSync({
      labels: [
        { name: 'good label', patterns: ['good'], exclusions: ['bad'] },
        {
          name: 'name',
          patterns: ['pattern\\'],
          exclusions: [],
        },
      ],
    });
  }).toThrow('There is an error in your regular expression pattern\\');
});

test('exclusions must be valid regular expressions', () => {
  expect(() => {
    validationSchema.validateSync({
      labels: [
        { name: 'good label', patterns: ['good'], exclusions: ['bad'] },
        {
          name: 'name',
          patterns: ['good'],
          exclusions: ['exclusion\\'],
        },
      ],
    });
  }).toThrow('There is an error in your regular expression exclusion\\');
});
