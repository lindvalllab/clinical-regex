import { GroupTypeBase, ValueContainerProps } from 'react-select';
import { CSSWithMultiValues } from '@chakra-ui/react';

import { NoticeProps } from 'react-select/src/components/Menu';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

export interface ItemProps extends CSSWithMultiValues {
  _disabled: CSSWithMultiValues;
  _focus: CSSWithMultiValues;
}

export interface HasSize {
  size: string;
}

export type HasSelectProps = {
  selectProps: HasSize;
};

export type ReactSelectOption = {
  label: string;
  value: string;
};

export type CustomValueContainerProps = ValueContainerProps<
  ReactSelectOption,
  false,
  GroupTypeBase<ReactSelectOption>
> &
  HasSelectProps;

export type CustomNoticeProps = NoticeProps<
  ReactSelectOption,
  false,
  GroupTypeBase<ReactSelectOption>
> &
  HasSelectProps;

export type CustomMultiValueRemoveProps = MultiValueRemoveProps<
  ReactSelectOption,
  GroupTypeBase<ReactSelectOption>
> & { isFocused: boolean };
