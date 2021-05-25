import * as Yup from 'yup';

const labelSchema = Yup.object({
  name: Yup.string().required('Required'),
  pattern: Yup.string().required('Required'),
});

const validationSchema = Yup.object({
  useId: Yup.boolean(),
  idCol: Yup.number().when('useId', {
    is: true,
    then: Yup.number().min(0, 'Required when "Group notes" is selected'),
  }),
  textCol: Yup.number().min(0, 'Required'),
  labels: Yup.array().min(1).of(labelSchema),
});

export default validationSchema;
