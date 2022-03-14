import * as Yup from 'yup';
import { REGEX_MATCH_ID } from '../../../electron/regexExclusions';

const validatePatterns = (
  patterns: (string | undefined)[] | undefined,
  context: Yup.TestContext
) => {
  // Ensure that patterns are valid regular expressions and
  // don't contain a named capture group with a reserved name.
  if (patterns === undefined) return false;

  for (const pattern of patterns) {
    if (pattern === undefined) return false;
    try {
      new RegExp(`(?<${REGEX_MATCH_ID}>test)|${pattern}`);
    } catch (e) {
      if (
        e instanceof SyntaxError &&
        /duplicate capture group name/i.test(e.message)
      ) {
        return context.createError({
          message: `Please do not use ${REGEX_MATCH_ID} as the name of a capture group.`,
        });
      } else {
        return context.createError({
          message: `There is an error in your regular expression ${pattern}`,
        });
      }
    }
  }

  return true;
};
const labelItemSchema = Yup.object({
  name: Yup.string().required('Required'),
  patterns: Yup.array().min(1, 'Required').of(Yup.string()).test({
    name: 'validate patterns',
    test: validatePatterns,
  }),
  exclusions: Yup.array().of(Yup.string()).test({
    name: 'validate patterns',
    test: validatePatterns,
  }),
});

export default Yup.object({
  labels: Yup.array().min(1).of(labelItemSchema),
});
