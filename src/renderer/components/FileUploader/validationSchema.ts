import * as Yup from 'yup';

const labelSchema = Yup.object({
  name: Yup.string().required('Required'),
  patterns: Yup.array().min(1, 'Required').of(Yup.string()),
});

const validationSchema = Yup.object({
  isGrouped: Yup.boolean(),
  idColIndex: Yup.number().when('isGrouped', {
    is: true,
    then: Yup.number().min(0, 'Required when "Group notes" is selected'),
  }),
  textColIndex: Yup.number()
    .min(0, 'Required')
    .when('isGrouped', {
      is: true,
      then: Yup.number().notOneOf(
        [Yup.ref('idColIndex')],
        'Cannot be the same as group ID'
      ),
    }),
  labels: Yup.array().min(1).of(labelSchema),
});

export default validationSchema;
