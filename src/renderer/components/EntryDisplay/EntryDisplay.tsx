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
import { useContext } from 'react';
import { ColorPaletteContext } from '../../ColorPaletteProvider';

type EntryDisplayProps = {
  entry: Entry;
  labels: LabelEntity[];
  highlights: { [textId: number]: SpanWithTag[] };
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const [contextWindow, setContextWindow] = useState<number | undefined>(
    DEFAULT_CONTEXT_WINDOW_SIZE
  );

  const { paletteFromLabels } = useContext(ColorPaletteContext);
  const palette = paletteFromLabels(props.labels);

  return (
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
            highlights={props.highlights[textObj.id]}
            palette={palette}
            contextWindow={
              contextWindow ? contextWindow : DEFAULT_CONTEXT_WINDOW_SIZE
            }
          />
        </Box>
      ))}
    </VStack>
  );
}

export default EntryDisplay;
