import { FormLabel, FormLabelProps } from '@chakra-ui/react';
import { HTMLProps, KeyboardEvent, ReactNode, useRef } from 'react';

type InlineUploadProps = {
  children: ReactNode;
  inputProps: Omit<HTMLProps<HTMLInputElement>, 'type'>;
} & FormLabelProps;

function InlineUpload(props: InlineUploadProps): JSX.Element {
  const { children, inputProps, ...labelProps } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clickInput = () => {
    if (fileInputRef.current !== null) fileInputRef.current.click();
  };

  const handleEnter = (event: KeyboardEvent<HTMLLabelElement>) => {
    // For accessibility, allow the user to activate the upload by focusing it and pressing enter.
    if (event.key === 'Enter') {
      clickInput();
    }
  };

  return (
    <FormLabel
      onClick={clickInput}
      onKeyDown={handleEnter}
      tabIndex={0}
      display="inline"
      m={0}
      cursor="pointer"
      {...labelProps}
    >
      {props.children}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        {...inputProps}
      />
    </FormLabel>
  );
}

export default InlineUpload;
