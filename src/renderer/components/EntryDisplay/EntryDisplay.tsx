import HighlightedText from '../HighlightedText';
import { Entry } from '../../../types';
import { useState } from 'react';
import { Box, Stack, VStack, Radio, RadioGroup } from '@chakra-ui/react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';

const DEFAULT_NO_CONTEXT_LINES = 2;
const CONTEXT_INCREMENT_SIZE = 2;

type EntryDisplayProps = {
  entry: Entry;
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const [noContextLines, setNoContextLines] = useState<number | undefined>(
    DEFAULT_NO_CONTEXT_LINES
  );

  const highlights = [
    {
      start: 1000,
      length: 10,
      tag: 'Foo',
    },
  ];

  const palette = {
    Foo: '#4089ff',
    Bar: '#f302fe',
  };

  return (
    <>
      <VStack spacing={4} p={8}>
        <FormControl as="fieldset">
          <FormLabel as="legend">Context Window</FormLabel>
          <RadioGroup
            defaultValue="2"
            onChange={(value) => {
              const newValue = value === 'all' ? undefined : Number(value);

              setNoContextLines(newValue);
            }}
            value={
              noContextLines === undefined ? 'all' : String(noContextLines)
            }
          >
            <Stack direction="row">
              <Radio value="2">2</Radio>
              <Radio value="5">5</Radio>
              <Radio value="10">10</Radio>
              <Radio value="50">50</Radio>
              <Radio value="100">100</Radio>
              <Radio value="all">Show entire text</Radio>
            </Stack>
          </RadioGroup>
          <FormHelperText>
            Number of lines of context to show around highlights.
          </FormHelperText>
        </FormControl>
        {props.entry.texts.map((textObj, index) => (
          <Box key={textObj.id} p={2} shadow="md" borderWidth="1px" w="full">
            <HighlightedText
              text={textObj.text}
              highlights={highlights}
              palette={palette}
              noContextLines={noContextLines}
              onClickMore={() =>
                noContextLines !== undefined &&
                setNoContextLines(noContextLines + CONTEXT_INCREMENT_SIZE)
              }
              onClickLess={() =>
                noContextLines !== undefined &&
                noContextLines > 2 &&
                setNoContextLines(noContextLines - CONTEXT_INCREMENT_SIZE)
              }
              isDisabledLess={
                noContextLines !== undefined && noContextLines <= 2
              }
            />
          </Box>
        ))}
      </VStack>
    </>
  );
}

export default EntryDisplay;
