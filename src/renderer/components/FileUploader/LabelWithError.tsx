import { Box, FormLabel } from '@chakra-ui/react';
import { ErrorMessage } from 'formik';

const renderError = (msg: string): JSX.Element => {
  return (
    <Box color="red" fontSize="0.8em">
      {msg}
    </Box>
  );
};

type LabelProps = {
  text: string;
  name: string;
};

const LabelWithError = (props: LabelProps): JSX.Element => {
  return (
    <Box display="flex" alignItems="flex-end" justifyContent="space-between">
      <FormLabel>{props.text}</FormLabel>
      <ErrorMessage name={props.name} render={renderError} />
    </Box>
  );
};

export default LabelWithError;
