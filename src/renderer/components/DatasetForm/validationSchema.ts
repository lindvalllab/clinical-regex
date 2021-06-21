import * as Yup from 'yup';

const validationSchema = Yup.object({
  isGrouped: Yup.boolean(),
  idColIndex: Yup.number().when('isGrouped', {
    is: true,
    then: Yup.number().min(0, 'Required'),
  }),
  textColIndex: Yup.number()
    .min(0, 'Required')
    .when('isGrouped', {
      is: true,
      then: Yup.number().notOneOf(
        [Yup.ref('idColIndex')],
        'Must be different from Group ID'
      ),
    }),
});

export default validationSchema;
