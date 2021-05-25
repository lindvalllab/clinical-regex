import * as Yup from 'yup';

const labelSchema = Yup.object({
  name: Yup.string().required('Required'),
  pattern: Yup.string().required('Required'),
});

const validationSchema = Yup.object({
  useId: Yup.boolean(),
  idCol: Yup.number().when('useId', {
    is: true,
    then: Yup.number().min(
      0,
      'Please select a column or uncheck the "Group notes" checkbox'
    ),
  }),
  textCol: Yup.number().min(0, 'Please select a column'),
  labels: Yup.array().min(1).of(labelSchema),
});

export default validationSchema;
