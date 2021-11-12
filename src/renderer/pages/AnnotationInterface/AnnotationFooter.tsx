import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useColorModeValue,
  Spacer,
  Stack,
  StackDivider,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaCog,
} from 'react-icons/fa';
import { CONTEXT_WINDOW_SIZE_OPTIONS, AUTO_HIDE_OPTIONS } from './constants';

type AnnotationFooterProps = {
  page: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  contextWindow: number;
  autoHide: typeof AUTO_HIDE_OPTIONS[keyof typeof AUTO_HIDE_OPTIONS];
  setContextWindow: (size: number) => void;
  setAutoHide: (
    option: typeof AUTO_HIDE_OPTIONS[keyof typeof AUTO_HIDE_OPTIONS]
  ) => void;
  CONTEXT_WINDOW_SIZE_OPTIONS: typeof CONTEXT_WINDOW_SIZE_OPTIONS;
  AUTO_HIDE_OPTIONS: typeof AUTO_HIDE_OPTIONS;
};

function AnnotationFooter({
  page,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  contextWindow,
  autoHide,
  setContextWindow,
  setAutoHide,
  CONTEXT_WINDOW_SIZE_OPTIONS,
  AUTO_HIDE_OPTIONS,
}: AnnotationFooterProps): JSX.Element {
  const bg = useColorModeValue('white', 'gray.800');
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  const DisplayOptions = (
    <Stack
      direction="row"
      spacing={6}
      divider={<StackDivider borderColor="gray.200" />}
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
          <Stack direction={{ base: 'column', xl: 'row' }}>
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
      <FormControl>
        <FormLabel fontSize="xs" color="gray.500" textTransform="uppercase">
          Auto-Hide
        </FormLabel>
        <RadioGroup
          onChange={(value) => {
            setAutoHide(value);
          }}
          value={autoHide}
          w="max-content"
        >
          <Stack direction={{ base: 'column', xl: 'row' }}>
            {Object.entries(AUTO_HIDE_OPTIONS).map(([_, value]) => (
              <Radio key={value} value={value}>
                {value}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    </Stack>
  );

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
      <Flex display={{ base: 'none', xl: 'flex' }}>{DisplayOptions}</Flex>
      <Popover placement="top-end">
        <PopoverTrigger>
          <Button
            display={{ base: 'flex', xl: 'none' }}
            leftIcon={<FaCog />}
            variant="outline"
          >
            Options
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Display Options</PopoverHeader>
          <PopoverBody>{DisplayOptions}</PopoverBody>
        </PopoverContent>
      </Popover>
      <Spacer />
      <ButtonGroup variant="outline">
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
