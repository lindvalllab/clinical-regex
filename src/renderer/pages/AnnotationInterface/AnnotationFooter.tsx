import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { CONTEXT_WINDOW_SIZE_OPTIONS } from './constants';

type AnnotationFooterProps = {
  page: number;
  totalPages: number;
  groupId: string;
  groupIdField?: string | null;
  onPrevPage: () => void;
  onNextPage: () => void;
  contextWindow: number;
  setContextWindow: (size: number) => void;
  CONTEXT_WINDOW_SIZE_OPTIONS: typeof CONTEXT_WINDOW_SIZE_OPTIONS;
};

function AnnotationFooter({
  page,
  totalPages,
  groupId,
  groupIdField,
  onPrevPage,
  onNextPage,
  contextWindow,
  setContextWindow,
  CONTEXT_WINDOW_SIZE_OPTIONS,
}: AnnotationFooterProps): JSX.Element {
  const bg = useColorModeValue('white', 'gray.800');
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  return (
    <Flex
      w="full"
      justify="space-between"
      position="sticky"
      bottom={0}
      bg={bg}
      py={4}
      px={6}
      borderTopWidth={1}
    >
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 1fr)"
        columnGap={4}
      >
        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
          Entry
        </Text>
        {groupId !== null ? (
          <Text fontSize="xs" color="gray.500" textTransform="uppercase">
            Group ID [
            {groupIdField ? `${groupIdField}` : 'No Group ID Field identified'}]
          </Text>
        ) : (
          <></>
        )}
        <Text fontSize="xs" color="gray.500" textTransform="uppercase">
          Context Window
        </Text>
        <Text fontSize="md" fontWeight="extrabold">
          {page + 1} / {totalPages}
        </Text>
        <Text fontSize="md" fontWeight="extrabold">
          {groupId}
        </Text>
        <RadioGroup
          onChange={(value) => {
            setContextWindow(Number(value));
          }}
          value={contextWindow}
        >
          <Stack direction="row">
            {Object.entries(CONTEXT_WINDOW_SIZE_OPTIONS).map(
              ([name, value]) => (
                <Radio key={value} value={value}>
                  {name}
                </Radio>
              )
            )}
          </Stack>
        </RadioGroup>
      </Grid>
      {/* <Box>
        <FormControl as="fieldset" ml={4}>
          <FormLabel as="legend">Context Window</FormLabel>
          <RadioGroup
            onChange={(value) => {
              setContextWindow(Number(value));
            }}
            value={contextWindow}
          >
            <Stack direction="row">
              {Object.entries(CONTEXT_WINDOW_SIZE_OPTIONS).map(
                ([name, value]) => (
                  <Radio key={value} value={value}>
                    {name}
                  </Radio>
                )
              )}
            </Stack>
          </RadioGroup>
          <FormHelperText>
            Number of words of context to show around highlights.
          </FormHelperText>
        </FormControl>
      </Box> */}
      <ButtonGroup isAttached>
        <Button colorScheme="gray" onClick={onPrevPage} disabled={isFirstPage}>
          Prev
        </Button>
        <Button colorScheme="gray" onClick={onNextPage} disabled={isLastPage}>
          Next
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export default AnnotationFooter;
