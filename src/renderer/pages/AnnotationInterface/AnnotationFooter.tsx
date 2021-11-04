import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  useColorModeValue,
  Spacer,
  Stack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { CONTEXT_WINDOW_SIZE_OPTIONS } from './constants';

type AnnotationFooterProps = {
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  contextWindow: number;
  setContextWindow: (size: number) => void;
  CONTEXT_WINDOW_SIZE_OPTIONS: typeof CONTEXT_WINDOW_SIZE_OPTIONS;
};

function AnnotationFooter({
  page,
  totalPages,
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
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
          Context Window
        </FormLabel>
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
      </FormControl>
      <Spacer />
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
