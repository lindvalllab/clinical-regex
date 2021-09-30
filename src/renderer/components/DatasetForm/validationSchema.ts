import * as Yup from 'yup';

const SUPPORTED_FORMATS = [
  {
    mimeType: 'text/csv',
    displayName: 'csv',
    extension: '.csv',
  },
];

const validateFile = (file: File) => {
  if (!file) return true;
  if (SUPPORTED_FORMATS.map((format) => format.mimeType).includes(file.type))
    return true;
  if (file.type === '')
    if (
      SUPPORTED_FORMATS.map((format) =>
        file.name.endsWith(format.extension)
      ).includes(true)
    )
      // Windows doesn't always recognize the text/csv mimeType.
      return true;
  return false;
};

const validationSchema = Yup.object({
  file: Yup.mixed()
    .required('Required')
    .test(
      'FILE_FORMAT',
      `File format must be one of: ${SUPPORTED_FORMATS.map(
        (format) => format.displayName
      ).join(', ')}`,
      validateFile
    ),
  isGrouped: Yup.boolean(),
  groupIdField: Yup.number().when('isGrouped', {
    is: true,
    then: Yup.number()
      .min(0, 'Required')
      .notOneOf([Yup.ref('textField')], 'Must be different from Text Field'),
  }),
  textField: Yup.number().min(0, 'Required'),
  fields: Yup.array(Yup.string()),
});

export default validationSchema;
