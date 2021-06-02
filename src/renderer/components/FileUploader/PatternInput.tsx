import { useState, KeyboardEvent } from 'react';
import { OptionTypeBase, OptionsType } from 'react-select';
import ChakraReactSelect from './ChakraReactSelect';

const createOption = (label: string) => ({
  label,
  value: label,
});

type PatternInputProps = {
  placeholder?: string;
};

function PatternInput(props: PatternInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<OptionsType<OptionTypeBase>>([]);

  const acceptInput = () => {
    if (inputValue.trim().length > 0) {
      setValue([...value, createOption(inputValue.trim())]);
      setInputValue('');
    }
  };

  const handleChange = (value: OptionsType<OptionTypeBase>) => {
    setValue(value);
  };
  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (['Enter', 'Tab'].includes(event.key)) {
      event.preventDefault();
      acceptInput();
    }
  };

  return (
    <ChakraReactSelect
      components={{ DropdownIndicator: null, ClearIndicator: null }}
      inputValue={inputValue}
      // options={groupedOptions}
      isClearable
      closeMenuOnSelect={false}
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={acceptInput}
      placeholder={props.placeholder}
      value={value}
    />
  );
}

export default PatternInput;
