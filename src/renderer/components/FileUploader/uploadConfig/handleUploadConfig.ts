import { ChangeEvent } from 'react';
import * as Yup from 'yup';
import validationErrorMessage from './errorMessage';

function findHeader(
  headers: string[],
  headerName: string,
  warnings: string[]
): number {
  // Return an index of the header name in the list of headers.
  // The warnings parameter is mutated.
  const index = headers.indexOf(headerName);
  if (headers.lastIndexOf(headerName) !== index) {
    warnings.push(
      `There are multiple columns named ${headerName}; ` +
        `please check that the selected one is correct.`
    );
  }
  return index;
}

const handleUploadConfig = (
  headers: string[],
  setFieldValue: (field: string, value: unknown) => void,
  setErrors: (errors: string[]) => void,
  setWarnings: (warnings: string[]) => void
): ((event: ChangeEvent<HTMLInputElement>) => Promise<void>) => {
  const label = Yup.object({
    name: Yup.string().required(),
    patterns: Yup.array().of(Yup.string()).required(),
  });

  const schema = Yup.object({
    groupIdField: Yup.string().oneOf(headers),
    textField: Yup.string().oneOf(headers),
    labels: Yup.array().of(label),
  });

  return async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (event.target.files) {
      const validationWarnings: string[] = [];
      const file = event.target.files[0];
      try {
        const configuration = JSON.parse(await file.text());
        schema
          .validate(configuration, { abortEarly: false })
          .then(() => {
            if (![null, undefined].includes(configuration.groupIdField)) {
              setFieldValue(
                'idColIndex',
                findHeader(
                  headers,
                  configuration.groupIdField,
                  validationWarnings
                )
              );
            }
            if (![null, undefined].includes(configuration.textField)) {
              setFieldValue(
                'textColIndex',
                findHeader(headers, configuration.textField, validationWarnings)
              );
            }
            if (![null, undefined].includes(configuration.labels)) {
              setFieldValue(`labels`, configuration.labels);
            }
            if (![null, undefined].includes(configuration.isGrouped)) {
              setFieldValue('isGrouped', Boolean(configuration.isGrouped));
            }
            setWarnings(validationWarnings);
          })
          .catch((errors) => {
            if (errors instanceof Yup.ValidationError) {
              setErrors(errors.inner.map(validationErrorMessage(headers)));
            } else console.error(errors);
          });
      } catch (error) {
        if (error instanceof SyntaxError) {
          setErrors(['The uploaded json file was invalid:\n' + error]);
        } else {
          console.error(error);
        }
      }
      event.target.value = '';
    }
  };
};

export default handleUploadConfig;
