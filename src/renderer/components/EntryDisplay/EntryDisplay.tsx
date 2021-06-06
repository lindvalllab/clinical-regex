import HighlightedText from '../HighlightedText';
import { Entry, LabelEntity, SpanWithTag } from '../../../types';
import { useState } from 'react';
import { Box, Stack, VStack, Radio, RadioGroup } from '@chakra-ui/react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import {
  DEFAULT_CONTEXT_WINDOW_SIZE,
  CONTEXT_WINDOW_SIZE_OPTIONS,
} from '../HighlightedText/constants';

type EntryDisplayProps = {
  entry: Entry;
  labels: LabelEntity[];
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const [contextWindow, setContextWindow] = useState<number | undefined>(
    DEFAULT_CONTEXT_WINDOW_SIZE
  );

  const highlights = (text: string): SpanWithTag[] => {
    const matches: SpanWithTag[] = [];
    for (const label of props.labels) {
      const re = new RegExp(label.pattern, 'gi');
      for (const match of Array.from(text.matchAll(re))) {
        if (match.index !== undefined) {
          matches.push({
            start: match.index,
            length: match[0].length,
            tag: label.name,
          });
        }
      }
    }
    return matches;
  };

  // Temporary solution to color palette: cycle through three different colors.
  const palette: Record<string, string> = {};
  const uniqueLabelNames = Array.from(
    new Set(props.labels.map((label) => label.name))
  );
  for (let i = 0; i < uniqueLabelNames.length; i++) {
    if (i % 3 === 0) palette[uniqueLabelNames[i]] = '#4089ff';
    else if (i % 3 === 1) palette[uniqueLabelNames[i]] = '#f302fe';
    else palette[uniqueLabelNames[i]] = '#ffd900';
  }

  return (
    <>
      <VStack spacing={4} p={8}>
        <FormControl as="fieldset">
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
        {props.entry.texts.map((textObj) => (
          <Box key={textObj.id} p={2} shadow="md" borderWidth="1px" w="full">
            <HighlightedText
              text={textObj.text}
              highlights={highlights(textObj.text)}
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
