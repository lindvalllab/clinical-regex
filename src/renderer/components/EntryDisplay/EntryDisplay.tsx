import HighlightedText from '../HighlightedText';
import { Entry } from '../../../types';
import { Box, VStack } from '@chakra-ui/layout';

type EntryDisplayProps = {
  entry: Entry;
};

function EntryDisplay(props: EntryDisplayProps): JSX.Element {
  const highlights = [
    {
      start: 0,
      length: 12,
      tag: 'Foo',
    },
    {
      start: 5,
      length: 12,
      tag: 'Bar',
    },
  ];

  const palette = {
    Foo: '#4089ff',
    Bar: '#f302fe',
  };

  return (
    <VStack spacing={4} p={8}>
      {props.entry.texts.map((textObj, index) => (
        <Box key={index} p={2} shadow="md" borderWidth="1px" w="full">
          <HighlightedText
            text={textObj.text}
            highlights={highlights}
            palette={palette}
          />
        </Box>
      ))}
    </VStack>
  );
}

export default EntryDisplay;
