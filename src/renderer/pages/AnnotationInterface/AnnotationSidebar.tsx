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
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { FaArrowAltCircleRight, FaCircle } from 'react-icons/fa';
import { CRAnnotation, Entry, LabelEntity } from '../../../types';
import { ApiContext } from '../../api';
import { getUnique } from '../../../utils';
import { ColorPaletteContext } from '../../ColorPaletteProvider';

type AnnotationSidebarProps = {
  entry: Entry;
  labels: LabelEntity[];
};

const initialAnnotations = (entry: Entry, labels: LabelEntity[]) => {
  const uniqueLabels = getUnique(
    labels.sort((e) => e.id).map((label) => label.name)
  );

  return uniqueLabels.map((name) => {
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
}: AnnotationSidebarProps): JSX.Element {
  const { palette } = useContext(ColorPaletteContext);
  const [annotations, setAnnotations] = useState(
    initialAnnotations(entry, labels)
  );
  const api = useContext(ApiContext);

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

  const onSubmit = () => {
    api.updateAnnotations(annotations);
  };

  return palette === undefined ? (
    <></>
  ) : (
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
          {annotations.map((annotation) => {
            return (
              <FormControl key={annotation.label}>
                <FormLabel mb={1}>
                  <Flex gridGap={2} alignItems="center">
                    <Icon
                      as={FaCircle}
                      color={palette[annotation.label]}
                      fontFamily="body"
                      borderRadius="full"
                      boxSize="0.8em"
                    />
                    <Text fontSize="sm">{annotation.label}</Text>
                  </Flex>
                </FormLabel>
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
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Flex>
  );
}

export default AnnotationSidebar;
