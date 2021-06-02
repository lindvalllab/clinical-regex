import { Box, FormLabel, Text } from '@chakra-ui/react';
import { HTMLProps } from 'react';

interface InlineUploadProps {
  id: string;
  text: string;
}

function InlineUpload(
  props: Omit<HTMLProps<HTMLInputElement>, 'type'> & InlineUploadProps
): JSX.Element {
  return (
    <>
      <FormLabel htmlFor={props.id} display="inline" p={0} m={0}>
        <Text
          role="button"
          aria-controls={props.id}
          display="inline"
          tabIndex={0}
        >
          {props.text}
        </Text>
      </FormLabel>
      <Box sx={{ display: 'none' }}>
        <input type="file" {...props} />
      </Box>
    </>
  );
}

export default InlineUpload;
