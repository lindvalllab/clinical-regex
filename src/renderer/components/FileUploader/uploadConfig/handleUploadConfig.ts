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
    title: Yup.string(),
    keywords: Yup.array().of(Yup.string()),
  });

  const schema = Yup.object({
    idCol: Yup.string().oneOf(headers),
    textCol: Yup.string().oneOf(headers),
    labels: Yup.array().of(label),
  });

  return async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (event.target.files) {
      const validationWarnings: string[] = [];
      const file = event.target.files[0];
      const configuration = JSON.parse(await file.text());
      schema
        .validate(configuration, { abortEarly: false })
        .then(() => {
          if (![null, undefined].includes(configuration.idCol)) {
            setFieldValue(
              'idColIndex',
              findHeader(headers, configuration.idCol, validationWarnings)
            );
          }
          if (![null, undefined].includes(configuration.textCol)) {
            setFieldValue(
              'textColIndex',
              findHeader(headers, configuration.textCol, validationWarnings)
            );
          }
          if (![null, undefined].includes(configuration.labels)) {
            for (let i = 0; i < configuration.labels.length; i++) {
              // Insert dummy data to ensure labels[i] has the right type at all times.
              setFieldValue(`labels.${i}`, { name: '', patterns: [] });
              setFieldValue(`labels.${i}.name`, configuration.labels[i].title);
              setFieldValue(
                `labels.${i}.patterns`,
                configuration.labels[i].keywords
              );
            }
          }
          if (![null, undefined].includes(configuration.isGrouped)) {
            setFieldValue('isGrouped', Boolean(configuration.isGrouped));
          }
          setWarnings(validationWarnings);
        })
        .catch((errors) => {
          console.log(errors.inner.map(validationErrorMessage(headers)));
          setErrors(errors.inner.map(validationErrorMessage(headers)));
        });
      event.target.value = '';
    }
  };
};

export default handleUploadConfig;
