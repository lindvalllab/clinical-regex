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
  Icon,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaArrowAltCircleRight, FaRegSquare, FaSquare } from 'react-icons/fa';
import { CRAnnotation, Entry } from '../../../types';
import { ColorPaletteFromLabels } from '.././../ColorPaletteProvider';

type AnnotationSidebarProps = {
  entry: Entry;
  labels: string[];
  matched: boolean[]; // Same length as labels; indicates which ones have a keyword match.
  palette: ColorPaletteFromLabels;
  onSubmit: (annotations: CRAnnotation[]) => void;
};

const initialAnnotations = (entry: Entry, labels: string[]) => {
  return labels.map((name) => {
    const annotationCandidates = entry.annotations.filter(
      (annotation) => annotation.label === name
    );

    let annotation: CRAnnotation;

    if (annotationCandidates.length > 1) {
      // TO-DO: handle better
      throw Error(`More than one annotation found for label with name ${name}`);
    } else if (annotationCandidates.length === 1) {
      const { id, ...rest } = annotationCandidates[0];
      annotation = rest;
    } else {
      annotation = {
        group_id: entry.groupId,
        label: name,
        value: 0,
      };
    }

    return annotation;
  });
};

function AnnotationSidebar({
  entry,
  labels,
  matched,
  palette,
  onSubmit,
}: AnnotationSidebarProps): JSX.Element {
  const [annotations, setAnnotations] = useState(
    initialAnnotations(entry, labels)
  );
  useEffect(() => {
    setAnnotations(initialAnnotations(entry, labels));
  }, [entry, labels]);

  const setAnnotationValue = (labelName: string, newValue: number) => {
    const newAnnotations = [...annotations];
    const index = newAnnotations.findIndex(
      (annotation) => annotation.label === labelName
    );

    newAnnotations[index].value = newValue;

    setAnnotations(newAnnotations);
  };

  // const onSubmit = () => {
  //   api.updateAnnotations(annotations).then(nextPage);
  // };

  return (
    <Flex
      borderWidth={1}
      pos="fixed"
      top="6.5rem"
      right="1.2em"
      w="calc(20vw - 1.8rem)"
      h="calc(100vh - 12.5rem)"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box overflowY="scroll" px={4} pt={6}>
        <VStack spacing={4} px={2}>
          {annotations.map((annotation, idx) => {
            return (
              <FormControl key={annotation.label}>
                <Tooltip
                  label={matched[idx] ? 'Match found' : 'No match found'}
                >
                  <FormLabel mb={1}>
                    <Flex gridGap={2} alignItems="center" cursor="pointer">
                      <Icon
                        as={matched[idx] ? FaSquare : FaRegSquare}
                        color={palette ? palette[annotation.label] : undefined}
                        fontFamily="body"
                        boxSize="0.8em"
                      />
                      <Text fontSize="sm">{annotation.label}</Text>
                    </Flex>
                  </FormLabel>
                </Tooltip>
                <NumberInput
                  onChange={(value) =>
                    setAnnotationValue(annotation.label, parseInt(value))
                  }
                  value={annotation.value}
                  size="md"
                >
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
        onClick={() => onSubmit(annotations)}
      >
        Submit
      </Button>
    </Flex>
  );
}

export default AnnotationSidebar;
