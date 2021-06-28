import * as Yup from 'yup';

const SUPPORTED_FORMATS = [
  {
    mimeType: 'text/csv',
    displayName: 'csv',
  },
];

const validationSchema = Yup.object({
  file: Yup.mixed()
    .required('Required')
    .test(
      'FILE_FORMAT',
      `File format must be one of: ${SUPPORTED_FORMATS.map(
        (format) => format.displayName
      ).join(', ')}`,
      (value: File) =>
        !value ||
        (value &&
          SUPPORTED_FORMATS.map((format) => format.mimeType).includes(
            value.type
          ))
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
