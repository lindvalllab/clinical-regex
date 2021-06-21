import { Container, Flex } from '@chakra-ui/react';
import { withFormik } from 'formik';
import DatasetForm from '../../components/DatasetForm';
import LabelForm from '../../components/LabelForm';
import {
  DatasetFormData,
  DatasetFormProps,
} from '../../components/DatasetForm/types';
import { LabelFormData } from '../../components/LabelForm/types';
// import FileUploader from '../../components/FileUploader';

interface FormProps {
  message?: string;
}
const TheDatasetForm = withFormik<DatasetFormProps, DatasetFormData>({
  mapPropsToValues: (props) => ({
    file: props.initialValues.file || ({} as File),
    isGrouped: props.initialValues.isGrouped || true,
    textField: props.initialValues.textField || -1,
    groupIdField: props.initialValues.groupIdField || -1,
  }),
  handleSubmit: (values) => console.log(values),
})(DatasetForm);

const TheLabelForm = withFormik<FormProps, LabelFormData>({
  handleSubmit: (values) => console.log(values),
})(LabelForm);

function NewProject(): JSX.Element {
  return (
    <Container>
      <Flex flexDirection="column" justifyContent="center">
        {/* <FileUploader /> */}
        <TheDatasetForm
          initialValues={{
            file: undefined,
            isGrouped: true,
            textField: -1,
            groupIdField: -1,
          }}
        />
        <TheLabelForm />
      </Flex>
    </Container>
  );
}

export default NewProject;
