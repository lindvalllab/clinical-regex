import * as Yup from 'yup';

const validationSchema = Yup.object({
  isGrouped: Yup.boolean(),
  groupIdField: Yup.number().when('isGrouped', {
    is: true,
    then: Yup.number()
      .min(0, 'Required')
      .notOneOf([Yup.ref('textField')], 'Must be different from Text Field'),
  }),
  textField: Yup.number().min(0, 'Required'),
});

export default validationSchema;
