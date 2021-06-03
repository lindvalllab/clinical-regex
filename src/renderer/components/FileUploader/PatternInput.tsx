import { useState, KeyboardEvent } from 'react';
import { OptionTypeBase, OptionsType } from 'react-select';
import ChakraReactSelect from './ChakraReactSelect';

const createOption = (label: string) => ({
  label,
  value: label,
});

type PatternInputProps = {
  placeholder?: string;
  onAddition?: (value: string[]) => void;
  onBlur?: () => void;
};

function PatternInput(props: PatternInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<OptionsType<OptionTypeBase>>([]);

  const acceptInput = () => {
    const newValue =
      inputValue.length > 0
        ? [...value, createOption(inputValue.trim())]
        : value;
    setValue(newValue);
    setInputValue('');
    if (props.onAddition !== undefined)
      props.onAddition(newValue.map((option) => option.label));
  };

  const handleChange = (value: OptionsType<OptionTypeBase>) => {
    setValue(value);
    if (props.onAddition !== undefined)
      props.onAddition(value.map((option) => option.label));
  };
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (['Enter', 'Tab'].includes(event.key) && inputValue.length > 0) {
      event.preventDefault();
      acceptInput();
    }
    if (props.onAddition !== undefined)
      props.onAddition(value.map((option) => option.label));
  };
  const onBlur = () => {
    acceptInput();
    if (props.onBlur !== undefined) props.onBlur();
  };

  return (
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
    />
  );
}

export default PatternInput;
