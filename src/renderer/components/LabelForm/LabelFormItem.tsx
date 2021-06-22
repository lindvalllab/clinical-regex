import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { FormikErrors, FormikTouched } from 'formik';
import { CRLabel } from '../../../types';
import { FaTrashAlt } from 'react-icons/fa';
import { ChangeEventHandler, ComponentProps } from 'react';
import PatternInput from './PatternInput';

type LabelFormItemProps = {
  displayNumber: number;
  label: CRLabel;
  isRemoveDisabled: boolean;
  onChangeName: ChangeEventHandler<HTMLInputElement>;
  onChangePatterns: ComponentProps<typeof PatternInput>['onChange'];
  onClickRemove: () => void;
  errors?: string | FormikErrors<CRLabel>;
  touched?: FormikTouched<CRLabel>;
};

function LabelFormItem(props: LabelFormItemProps): JSX.Element {
  const {
    displayNumber,
    label,
    touched,
    onChangeName,
    onChangePatterns,
    onClickRemove,
    isRemoveDisabled,
  } = props;
  // ugly workaround for this issue:
  // github.com/formium/formik/issues/2347#issuecomment-724640730
  // seems like the case it was complaining about was when
  // typeof errors === 'string'
  const errors = typeof props.errors === 'string' ? undefined : props.errors;

  return (
    <Flex gridGap={2} flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="sm">Label {displayNumber}</Heading>
        <Button
          leftIcon={<FaTrashAlt />}
          size="sm"
          onClick={onClickRemove}
          isDisabled={isRemoveDisabled}
        >
          Remove
        </Button>
      </Flex>
      <FormControl isInvalid={errors?.name !== undefined && touched?.name}>
        <Flex justifyContent="space-between" alignItems="center" py={1}>
          <FormLabel m={0} alignSelf="center">
            Name
          </FormLabel>
          <FormErrorMessage my={0}>{errors?.name}</FormErrorMessage>
        </Flex>
        <Input
          value={label.name}
          onChange={onChangeName}
          placeholder="Palliative Care"
        />
      </FormControl>
      <FormControl
        isInvalid={errors?.patterns !== undefined && touched?.patterns}
      >
        <Flex justifyContent="space-between" alignItems="center" py={1}>
          <FormLabel
            m={0}
            alignSelf="center"
            htmlFor={`patterns-${displayNumber}`}
          >
            Patterns
          </FormLabel>
          <FormErrorMessage my={0}>{errors?.patterns}</FormErrorMessage>
        </Flex>
        <PatternInput
          inputId={`patterns-${displayNumber}`}
          value={label.patterns}
          onChange={onChangePatterns}
          placeholder="pall(iative)? (care|medicine)"
        />
      </FormControl>
    </Flex>
  );
}

export default LabelFormItem;
