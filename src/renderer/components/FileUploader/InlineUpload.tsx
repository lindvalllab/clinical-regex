import { Box, FormLabel, Text } from '@chakra-ui/react';
import { HTMLProps, KeyboardEvent, useRef } from 'react';

interface InlineUploadProps {
  id: string;
  text: string;
}

function InlineUpload(
  props: Omit<HTMLProps<HTMLInputElement>, 'type'> & InlineUploadProps
): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEnter(event: KeyboardEvent<HTMLLabelElement>) {
    // For accessibility, allow the user to activate the upload by focusing it and pressing enter.
    if (event.key === 'Enter') {
      if (fileInputRef.current !== null) fileInputRef.current.click();
    }
  }

  return (
    <>
      <FormLabel
        htmlFor={props.id}
        display="inline"
        p={0}
        m={0}
        color={props.color}
        onKeyDown={handleEnter}
      >
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
        <input type="file" ref={fileInputRef} {...props} />
      </Box>
    </>
  );
}

export default InlineUpload;
