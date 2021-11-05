import HighlightedText from '../HighlightedText';
import { Entry, LabelEntity, SpanWithTag } from '../../../types';
import { Box, VStack } from '@chakra-ui/react';

import { ColorPaletteFromLabels } from '../../ColorPaletteProvider';

type EntryDisplayProps = {
  entry: Entry;
  labels: LabelEntity[];
  highlights: { [textId: number]: SpanWithTag[] };
  palette: ColorPaletteFromLabels;
  contextWindow: number;
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const texts = props.entry.texts.sort(
    (a, b) => props.highlights[b.id].length - props.highlights[a.id].length
  );
  return (
    <VStack spacing={4}>
      {texts.map((textObj) => {
        const highlights = props.highlights[textObj.id]
          ? props.highlights[textObj.id]
          : [];
        return (
          <Box key={textObj.id} p={2} shadow="md" borderWidth="1px" w="full">
            <HighlightedText
              text={textObj.text}
              highlights={highlights}
              palette={props.palette}
              contextWindow={props.contextWindow}
              isHidden={highlights.length <= 0}
            />
          </Box>
        );
      })}
    </VStack>
  );
}

export default EntryDisplay;
