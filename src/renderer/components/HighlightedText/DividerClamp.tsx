import {
  Box,
  Divider,
  Flex,
  Button,
  ButtonGroup,
  FlexProps,
} from '@chakra-ui/react';

type DividerClampProps = {
  number: number;
  isDisabledLess?: boolean;
  onClickLess?: () => void;
  onClickMore?: () => void;
} & FlexProps;

const DividerClamp = ({
  number,
  isDisabledLess,
  onClickLess,
  onClickMore,
  ...props
}: DividerClampProps): JSX.Element => (
  <Flex
    w="100%"
    fontFamily="body"
    fontSize="xs"
    alignItems="center"
    gridGap={4}
    opacity={0.5}
    {...props}
  >
    <Box whiteSpace="nowrap">
      {number} word{number !== 1 ? 's' : null} not shown
    </Box>
    <Divider />
    <ButtonGroup
      variant="ghost"
      colorScheme="gray"
      size="xs"
      spacing={2}
      alignItems="center"
    >
      <Button onClick={onClickLess} disabled={isDisabledLess}>
        Less
      </Button>
      <Button onClick={onClickMore}>More</Button>
    </ButtonGroup>
  </Flex>
);

export default DividerClamp;
