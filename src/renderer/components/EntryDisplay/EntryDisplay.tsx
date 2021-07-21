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
import { ColorPaletteFromLabels } from '../../ColorPaletteProvider';

type EntryDisplayProps = {
  entry: Entry;
  labels: LabelEntity[];
  highlights: { [textId: number]: SpanWithTag[] };
  palette: ColorPaletteFromLabels;
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const [contextWindow, setContextWindow] = useState<number | undefined>(
    DEFAULT_CONTEXT_WINDOW_SIZE
  );

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
      {props.entry.texts.map((textObj) => {
        const highlights = props.highlights[textObj.id]
          ? props.highlights[textObj.id]
          : [];
        return (
          <Box key={textObj.id} p={2} shadow="md" borderWidth="1px" w="full">
            <HighlightedText
              text={textObj.text}
              highlights={highlights}
              palette={props.palette}
              contextWindow={
                contextWindow ? contextWindow : DEFAULT_CONTEXT_WINDOW_SIZE
              }
              isHidden={highlights.length <= 0}
            />
          </Box>
        );
      })}
    </VStack>
  );
}

export default EntryDisplay;
