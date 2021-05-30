import { Box, Divider, Flex, Button, ButtonGroup } from '@chakra-ui/react';

type DividerClampProps = {
  number: number;
  isDisabledLess?: boolean;
  onClickLess?: () => void;
  onClickMore?: () => void;
};

const DividerClamp = ({
  number,
  isDisabledLess,
  onClickLess,
  onClickMore,
}: DividerClampProps): JSX.Element => (
  <Flex
    w="100%"
    p={2}
    fontFamily="body"
    fontSize="xs"
    alignItems="center"
    gridGap={4}
    opacity={0.4}
    m={4}
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
