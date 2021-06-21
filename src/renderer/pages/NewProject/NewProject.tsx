import { Button, Container } from '@chakra-ui/react';
import { Form, Formik, withFormik } from 'formik';
import DatasetForm from '../../components/DatasetForm';
import LabelForm from '../../components/LabelForm';
import datasetValidation from '../../components/DatasetForm/validationSchema';

function NewProject(): JSX.Element {
  return (
    <Container>
      <Formik
        initialValues={{
          file: undefined,
          isGrouped: true,
          textField: -1,
          groupIdField: -1,
          labels: [{ name: '', patterns: [] }],
        }}
        validationSchema={datasetValidation}
        onSubmit={(values, actions) => console.log(values)}
      >
        <Form>
          <DatasetForm />
          <LabelForm />
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </Container>
  );
}

export default NewProject;
