import * as Yup from 'yup';

export default Yup.object({
  name: Yup.string().required('Required'),
  patterns: Yup.array().min(1, 'Required').of(Yup.string()),
});
