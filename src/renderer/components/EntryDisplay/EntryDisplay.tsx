import HighlightedText from '../HighlightedText';
import { Entry, LabelEntity, SpanWithTag } from '../../../types';
import { Box, VStack } from '@chakra-ui/react';

import { ColorPaletteFromLabels } from '../../ColorPaletteProvider';
import { AUTO_HIDE_OPTIONS } from '../../pages/AnnotationInterface/constants';

type EntryDisplayProps = {
  entry: Entry;
  labels: LabelEntity[];
  highlights: { [textId: number]: SpanWithTag[] };
  palette: ColorPaletteFromLabels;
  contextWindow: number;
  autoHide: typeof AUTO_HIDE_OPTIONS[keyof typeof AUTO_HIDE_OPTIONS];
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const texts = props.entry.texts.sort(
    (a, b) => props.highlights[b.id].length - props.highlights[a.id].length
  );

  let isHidden: (highlights: SpanWithTag[]) => boolean;

  switch (props.autoHide) {
    case AUTO_HIDE_OPTIONS.None:
      isHidden = (highlights) => false;
      break;

    case AUTO_HIDE_OPTIONS.WithoutMatches:
      isHidden = (highlights) => highlights.length <= 0;
      break;

    case AUTO_HIDE_OPTIONS.WithMatches:
      isHidden = (highlights) => highlights.length > 0;
      break;

    case AUTO_HIDE_OPTIONS.All:
      isHidden = (highlights) => true;
      break;

    default:
      isHidden = (highlights) => highlights.length <= 0;
  }

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
              isHidden={isHidden(highlights)}
            />
          </Box>
        );
      })}
    </VStack>
  );
}

export default EntryDisplay;
