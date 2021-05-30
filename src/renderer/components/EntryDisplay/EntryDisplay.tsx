import HighlightedText from '../HighlightedText';
import { Entry } from '../../../types';
import { useState } from 'react';
import { Box, Stack, VStack, Radio, RadioGroup } from '@chakra-ui/react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import { DEFAULT_CONTEXT_WINDOW_SIZE } from '../HighlightedText/constants';

type EntryDisplayProps = {
  entry: Entry;
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const [contextWindow, setContextWindow] = useState<number | undefined>(
    DEFAULT_CONTEXT_WINDOW_SIZE
  );

  const highlights = [
    {
      start: 50,
      length: 5,
      tag: 'Foo',
    },
    {
      start: 48,
      length: 50,
      tag: 'Bar',
    },
    {
      start: 2500,
      length: 150,
      tag: 'Foo',
    },
    {
      start: 1000,
      length: 10,
      tag: 'Baz',
    },
  ];

  const palette = {
    Foo: '#4089ff',
    Bar: '#f302fe',
    Baz: '#ffd900',
  };

  return (
    <>
      <VStack spacing={4} p={8}>
        <FormControl as="fieldset">
          <FormLabel as="legend">Context Window</FormLabel>
          <RadioGroup
            onChange={(value) => {
              console.log(`Clicked ${value}`);
              setContextWindow(Number(value));
            }}
            value={String(contextWindow)}
          >
            <Stack direction="row">
              <Radio value="5">5</Radio>
              <Radio value="10">10</Radio>
              <Radio value="50">50</Radio>
              <Radio value="100">100</Radio>
              <Radio value="-1">Show entire text</Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText>
            Number of words of context to show around highlights.
          </FormHelperText>
        </FormControl>
        {props.entry.texts.map((textObj) => (
          <Box key={textObj.id} p={2} shadow="md" borderWidth="1px" w="full">
            <HighlightedText
              text={textObj.text}
              highlights={highlights}
              palette={palette}
              contextWindow={
                contextWindow ? contextWindow : DEFAULT_CONTEXT_WINDOW_SIZE
              }
            />
          </Box>
        ))}
      </VStack>
    </>
  );
}

export default EntryDisplay;
