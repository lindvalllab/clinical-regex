/* Use react-select with chakra-ui. Written by Christopher Sandvik, @csandman on GitHub.
 * https://gist.github.com/csandman/c687a9fb4275112f281ab9a5701457e4 */
import { cloneElement } from 'react';
import ReactSelect, {
  components as selectComponents,
  Props as SelectProps,
  GroupTypeBase,
  OptionTypeBase,
  Theme,
  ValueContainerProps,
} from 'react-select';
import AsyncReactSelect from 'react-select/async';
import {
  Flex,
  Tag,
  TagCloseButton,
  TagLabel,
  Divider,
  CloseButton,
  CSSWithMultiValues,
  Center,
  Box,
  Portal,
  RecursiveCSSObject,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  useTheme,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';
import { NoticeProps } from 'react-select/src/components/Menu';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';

interface ItemProps extends CSSWithMultiValues {
  _disabled: CSSWithMultiValues;
  _focus: CSSWithMultiValues;
}

interface HasSize {
  size: string;
}

type HasSelectProps = {
  selectProps: HasSize;
};

interface ReactSelectOption {
  label: string;
  value: string;
}

type CustomValueContainerProps = ValueContainerProps<
  ReactSelectOption,
  false,
  GroupTypeBase<ReactSelectOption>
> &
  HasSelectProps;

type CustomNoticeProps = NoticeProps<
  ReactSelectOption,
  false,
  GroupTypeBase<ReactSelectOption>
> &
  HasSelectProps;

type CustomMultiValueRemoveProps = MultiValueRemoveProps<
  ReactSelectOption,
  GroupTypeBase<ReactSelectOption>
> & { isFocused: boolean };

// Taken from the @chakra-ui/icons package to prevent needing it as a dependency
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/icons/src/ChevronDown.tsx
const ChevronDown = createIcon({
  displayName: 'ChevronDownIcon',
  d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
});

// Custom styles for components which do not have a chakra equivalent
const chakraStyles: SelectProps['styles'] = {
  input: (provided) => ({
    ...provided,
    color: 'inherit',
    lineHeight: 1,
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: 'none',
  }),
  valueContainer: (
    provided,
    { selectProps: { size } }: CustomValueContainerProps
  ) => {
    const px: Record<string, string> = {
      sm: '0.75rem',
      md: '1rem',
      lg: '1rem',
    };

    return {
      ...provided,
      padding: `0.125rem ${px[size]}`,
    };
  },
  loadingMessage: (provided, { selectProps: { size } }: CustomNoticeProps) => {
    const fontSizes: Record<string, string> = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    };

    const paddings: Record<string, string> = {
      sm: '6px 9px',
      md: '8px 12px',
      lg: '10px 15px',
    };

    return {
      ...provided,
      fontSize: fontSizes[size],
      padding: paddings[size],
    };
  },
  // Add the chakra style for when a TagCloseButton has focus
  multiValueRemove: (
    provided,
    {
      isFocused,
      selectProps: { multiValueRemoveFocusStyle },
    }: CustomMultiValueRemoveProps
  ) => (isFocused ? multiValueRemoveFocusStyle : {}),
  control: () => ({}),
  menuList: () => ({}),
  option: () => ({}),
  multiValue: () => ({}),
  multiValueLabel: () => ({}),
  group: () => ({}),
};

const chakraComponents: SelectProps['components'] = {
  // Control components
  Control: ({
    children,
    innerRef,
    innerProps,
    isDisabled,
    isFocused,
    selectProps: { size },
  }) => {
    const inputStyles = useMultiStyleConfig('Input', { size });

    const heights: Record<string, number> = {
      sm: 8,
      md: 10,
      lg: 12,
    };

    return (
      <StylesProvider value={inputStyles}>
        <Flex
          ref={innerRef}
          sx={{
            ...inputStyles.field,
            p: 0,
            overflow: 'hidden',
            h: 'auto',
            minH: heights[size],
          }}
          {...innerProps}
          {...(isFocused && { 'data-focus': true })}
          {...(isDisabled && { disabled: true })}
        >
          {children}
        </Flex>
      </StylesProvider>
    );
  },
  MultiValueContainer: ({
    children,
    innerRef,
    innerProps,
    data: { isFixed },
    selectProps: { size },
  }) => (
    <Tag
      ref={innerRef}
      {...innerProps}
      m="0.125rem"
      // react-select Fixed Options example: https://react-select.com/home#fixed-options
      variant={isFixed ? 'solid' : 'subtle'}
      size={size}
    >
      {children}
    </Tag>
  ),
  MultiValueLabel: ({ children, innerRef, innerProps }) => (
    <TagLabel ref={innerRef} {...innerProps}>
      {children}
    </TagLabel>
  ),
  MultiValueRemove: ({ children, innerRef, innerProps, data: { isFixed } }) => {
    if (isFixed) {
      return null;
    }

    return (
      <TagCloseButton ref={innerRef} {...innerProps} tabIndex={-1}>
        {children}
      </TagCloseButton>
    );
  },
  IndicatorSeparator: ({ innerProps }) => (
    <Divider {...innerProps} orientation="vertical" opacity="1" />
  ),
  ClearIndicator: ({ innerProps, selectProps: { size } }) => (
    <CloseButton {...innerProps} size={size} mx={2} tabIndex={-1} />
  ),
  DropdownIndicator: ({ innerProps, selectProps: { size } }) => {
    const { addon } = useStyles();

    const iconSizes: Record<string, number> = {
      sm: 4,
      md: 5,
      lg: 6,
    };
    const iconSize = iconSizes[size];

    return (
      <Center
        {...innerProps}
        sx={{
          ...addon,
          h: '100%',
          borderRadius: 0,
          borderWidth: 0,
          cursor: 'pointer',
        }}
      >
        <ChevronDown h={iconSize} w={iconSize} />
      </Center>
    );
  },
  // Menu components
  MenuPortal: ({ children }) => <Portal>{children}</Portal>,
  Menu: ({ children, ...props }) => {
    const menuStyles = useMultiStyleConfig('Menu', {});
    return (
      <selectComponents.Menu {...props}>
        <StylesProvider value={menuStyles}>{children}</StylesProvider>
      </selectComponents.Menu>
    );
  },
  MenuList: ({ innerRef, children, maxHeight, selectProps: { size } }) => {
    const { list } = useStyles();

    // The same border radii that the Input use
    const chakraTheme = useTheme();
    const borderRadii: Record<string, string> = {
      sm: chakraTheme.radii.sm,
      md: chakraTheme.radii.md,
      lg: chakraTheme.radii.md,
    };

    return (
      <Box
        sx={{
          ...list,
          maxH: `${maxHeight}px`,
          overflowY: 'auto',
          borderRadius: borderRadii[size],
        }}
        ref={innerRef}
      >
        {children}
      </Box>
    );
  },
  GroupHeading: ({ innerProps, children }) => {
    const { groupTitle } = useStyles();
    return (
      <Box sx={groupTitle} {...innerProps}>
        {children}
      </Box>
    );
  },
  Option: ({
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    selectProps: { size },
  }) => {
    const { item } = useStyles() as { item: RecursiveCSSObject<ItemProps> };
    return (
      <Box
        role="button"
        sx={{
          ...item,
          w: '100%',
          textAlign: 'left',
          bg: isFocused ? item._focus.bg : 'transparent',
          fontSize: size,
          ...(isDisabled && item._disabled),
        }}
        ref={innerRef}
        {...innerProps}
        {...(isDisabled && { disabled: true })}
      >
        {children}
      </Box>
    );
  },
};

const ChakraReactSelect = <
  OptionType extends OptionTypeBase = ReactSelectOption,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>({
  children,
  styles = {},
  components = {},
  theme = (theme) => theme,
  size = 'md',
  ...props
}: SelectProps<OptionType, IsMulti, GroupType>) => {
  const chakraTheme = useTheme();

  // The chakra theme styles for TagCloseButton when focused
  const closeButtonFocus =
    chakraTheme.components.Tag.baseStyle.closeButton._focus;
  const multiValueRemoveFocusStyle = {
    background: closeButtonFocus.bg,
    boxShadow: chakraTheme.shadows[closeButtonFocus.boxShadow],
  };

  // The chakra UI global placeholder color
  // https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/styles.ts#L13
  const placeholderColor = useColorModeValue(
    chakraTheme.colors.gray[400],
    chakraTheme.colors.whiteAlpha[400]
  );

  // Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
  let realSize = size;
  const sizeOptions = ['sm', 'md', 'lg'];
  if (!sizeOptions.includes(size)) {
    realSize = 'md';
  }

  const select = cloneElement(children, {
    components: {
      ...chakraComponents,
      ...components,
    },
    styles: {
      ...chakraStyles,
      ...styles,
    },
    theme: (baseTheme: Theme) => {
      const propTheme = typeof theme === 'function' ? theme(baseTheme) : theme;

      return {
        ...baseTheme,
        ...propTheme,
        colors: {
          ...baseTheme.colors,
          neutral50: placeholderColor, // placeholder text color
          neutral40: placeholderColor, // noOptionsMessage color
          ...propTheme.colors,
        },
        spacing: {
          ...baseTheme.spacing,
          ...propTheme.spacing,
        },
      };
    },
    size: realSize,
    multiValueRemoveFocusStyle,
    ...props,
  });

  return select;
};

const Select = <
  OptionType extends OptionTypeBase = ReactSelectOption,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>(
  props: SelectProps<OptionType, IsMulti, GroupType>
): JSX.Element => (
  <ChakraReactSelect {...props}>
    <ReactSelect />
  </ChakraReactSelect>
);

const AsyncSelect = <
  OptionType extends OptionTypeBase = ReactSelectOption,
  IsMulti extends boolean = false,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>(
  props: SelectProps<OptionType, IsMulti, GroupType>
): JSX.Element => (
  <ChakraReactSelect {...props}>
    <AsyncReactSelect />
  </ChakraReactSelect>
);

export { Select as default, AsyncSelect };
