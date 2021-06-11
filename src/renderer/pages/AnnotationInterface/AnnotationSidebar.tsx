import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from '@chakra-ui/react';
import { Entry, LabelEntity } from '../../../types';

type AnnotationSidebarContentProps = {
  entry: Entry;
  labels: LabelEntity[];
};

type AnnotationSidebarProps = AnnotationSidebarContentProps;

function AnnotationSidebarContent(
  props: AnnotationSidebarContentProps
): JSX.Element {
  return (
    <VStack spacing={4}>
      {props.labels.map((label) => {
        return (
          <FormControl>
            <FormLabel fontSize="sm">{label.name}</FormLabel>
            <NumberInput defaultValue={0} size="sm">
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        );
      })}
    </VStack>
  );
}

function AnnotationSidebar(props: AnnotationSidebarProps): JSX.Element {
  return (
    <Flex
      borderWidth={1}
      pos="fixed"
      top="6.5rem"
      right="2em"
      w="calc(20vw - 2rem)"
      h="calc(100vh - 13rem)"
      p={6}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box overflowY="scroll" p={2}>
        <AnnotationSidebarContent {...props} />
      </Box>
      <Button mt={4} flexShrink={0} colorScheme="green">
        Submit
      </Button>
    </Flex>
  );
}

export default AnnotationSidebar;
