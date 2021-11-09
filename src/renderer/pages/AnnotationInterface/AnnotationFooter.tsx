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
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';
import { CONTEXT_WINDOW_SIZE_OPTIONS } from './constants';

type AnnotationFooterProps = {
  page: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  contextWindow: number;
  setContextWindow: (size: number) => void;
  CONTEXT_WINDOW_SIZE_OPTIONS: typeof CONTEXT_WINDOW_SIZE_OPTIONS;
};

function AnnotationFooter({
  page,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
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
      alignItems="center"
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
      <ButtonGroup variant="ghost" colorScheme="gray" size="sm">
        <Button
          onClick={onFirstPage}
          disabled={isFirstPage}
          leftIcon={<FaAngleDoubleLeft />}
        >
          First
        </Button>
        <Button
          onClick={onPrevPage}
          disabled={isFirstPage}
          leftIcon={<FaAngleLeft />}
        >
          Prev
        </Button>
        <Button
          onClick={onNextPage}
          disabled={isLastPage}
          rightIcon={<FaAngleRight />}
        >
          Next
        </Button>
        <Button
          onClick={onLastPage}
          disabled={isLastPage}
          rightIcon={<FaAngleDoubleRight />}
        >
          Last
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export default AnnotationFooter;
