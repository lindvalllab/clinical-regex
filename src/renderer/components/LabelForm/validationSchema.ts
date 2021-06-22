import * as Yup from 'yup';

const labelItemSchema = Yup.object({
  name: Yup.string().required('Required'),
  patterns: Yup.array().min(1, 'Required').of(Yup.string()),
});

export default Yup.object({
  labels: Yup.array().min(1).of(labelItemSchema),
});
