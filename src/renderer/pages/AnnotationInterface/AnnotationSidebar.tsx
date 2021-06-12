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
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { Entry, LabelEntity } from '../../../types';
import { getUnique } from '../../components/HighlightedText/utils';

type AnnotationSidebarProps = {
  entry: Entry;
  labels: LabelEntity[];
};

function AnnotationSidebar({
  entry,
  labels,
}: AnnotationSidebarProps): JSX.Element {
  const uniqueLabels = getUnique(labels.map((e) => e.name));

  return (
    <Flex
      borderWidth={1}
      pos="fixed"
      top="6.5rem"
      right="2em"
      w="calc(20vw - 2rem)"
      h="calc(100vh - 13rem)"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box overflowY="scroll" px={4} pt={6}>
        <VStack spacing={4} px={2}>
          {uniqueLabels.map((label) => {
            return (
              <FormControl key={label}>
                <FormLabel
                  fontSize="xs"
                  fontFamily="heading"
                  textTransform="uppercase"
                  mb={1}
                >
                  {label}
                </FormLabel>
                <NumberInput defaultValue={0} size="md">
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
      </Box>
      <Button
        m={4}
        flexShrink={0}
        colorScheme="green"
        rightIcon={<FaArrowAltCircleRight />}
      >
        Submit
      </Button>
    </Flex>
  );
}

export default AnnotationSidebar;
