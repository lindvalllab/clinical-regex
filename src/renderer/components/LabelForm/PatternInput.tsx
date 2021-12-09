import { useEffect, useState, ClipboardEvent, KeyboardEvent } from 'react';
import { OptionTypeBase, OptionsType } from 'react-select';
import ChakraReactSelect from '../ChakraReactSelect';
import { Box } from '@chakra-ui/react';

const createOption = (label: string) => ({
  label,
  value: label,
});

type PatternInputProps = {
  placeholder?: string;
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  value: string[];
  inputId?: string;
};

function PatternInput(props: PatternInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<OptionsType<OptionTypeBase>>(
    props.value !== undefined ? props.value.map(createOption) : []
  );

  useEffect(() => {
    setValue(props.value.map(createOption));
  }, [props.value]);

  const acceptInput = () => {
    const newValue =
      inputValue.length > 0
        ? [...value, createOption(inputValue.trim())]
        : value;
    setValue(newValue);
    setInputValue('');
    if (props.onChange !== undefined)
      props.onChange(newValue.map((option) => option.label));
  };
  const handleChange = (value: OptionsType<OptionTypeBase>) => {
    setValue(value);
    if (props.onChange !== undefined)
      props.onChange(value.map((option) => option.label));
  };
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (['Enter', 'Tab'].includes(event.key) && inputValue.length > 0) {
      event.preventDefault();
      acceptInput();
    }
  };
  const onBlur = () => {
    acceptInput();
    if (props.onBlur !== undefined) props.onBlur();
  };
  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .split(/\r?\n/)
      .filter((x) => x.length > 0);
    // The first element of the pasted text will be combined with the already existing input.
    pasted[0] = inputValue + pasted[0];
    // The last element of the paste is handled differently:
    // it is set as the inputValue instead of the value.
    const last = pasted.pop();
    if (last !== undefined) {
      setValue([...value, ...pasted.map(createOption)]);
      setInputValue(last);
    }
  };

  return (
    // react-select doesn't handle onPaste, so wrap in a Box
    <Box onPaste={handlePaste}>
      <ChakraReactSelect
        components={{ DropdownIndicator: null, ClearIndicator: null }}
        inputValue={inputValue}
        isClearable
        closeMenuOnSelect={false}
        isMulti
        menuIsOpen={false}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={props.placeholder}
        value={value}
        inputId={props.inputId}
      />
    </Box>
  );
}

export default PatternInput;
