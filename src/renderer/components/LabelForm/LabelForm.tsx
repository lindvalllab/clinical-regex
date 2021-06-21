import { Flex, FormControl } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { LabelFormData } from './types';

function LabelForm(): JSX.Element {
  const { values, setFieldValue } = useFormikContext<LabelFormData>();

  return (
    <Flex flexDirection="column" gridGap={4}>
      <FormControl></FormControl>
    </Flex>
  );
}

export default LabelForm;
