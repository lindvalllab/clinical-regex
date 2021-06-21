import { Flex, FormControl } from '@chakra-ui/react';
import { FormikProps } from 'formik';
import { LabelFormData } from './types';

function LabelForm(props: FormikProps<LabelFormData>): JSX.Element {
  const { values, setFieldValue } = props;

  return (
    <Flex flexDirection="column" gridGap={4}>
      <FormControl></FormControl>
    </Flex>
  );
}

export default LabelForm;
