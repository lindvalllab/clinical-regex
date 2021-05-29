import c_c from 'color-mixer';
import flattenSpans from './flattenSpans';
import { SpanWithTag, SpanWithTags } from '../../../types';
import {
  Box,
  Divider,
  Flex,
  Text,
  Tooltip,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
  noContextLines?: number;
  onClickLess?: () => void;
  onClickMore?: () => void;
  isDisabledLess?: boolean;
};

const getColor = (
  tags: string[],
  palette: Record<string, string>
): string | undefined => {
  if (tags.length === 0) {
    return undefined;
  }

  const colors = tags.map((tag: string) => {
    const color = palette[tag] ? palette[tag] : null;
    return new c_c.Color(color ? { hex: color } : { name: 'transparent' });
  });

  if (colors.length === 1) {
    return colors[0].hex();
  } else if (colors.length > 1) {
    const color = new c_c.Color({ mix: colors });
    return color.hex();
  }

  return undefined;
};

const getTooltip = (span: SpanWithTags): string => {
  return span.tags.join(', ');
};

const HighlightedText = (props: HighlightedTextProps): JSX.Element => {
  const resolvedSpans = flattenSpans(props.text, props.highlights);
  const hasNoHighlights =
    resolvedSpans.length === 1 && resolvedSpans[0].tags.length === 0;

  const toDisplay = resolvedSpans.map((span, index) => {
    const isFirstSpan = index === 0;
    const isLastSpan = index === resolvedSpans.length - 1;
    const isHighlight = span.tags.length !== 0;
    const textContent = props.text.slice(span.start, span.start + span.length);

    const format = (text: string): ReactNode => {
      const lines = text.split('\n');
      if (
        isHighlight ||
        props.noContextLines === undefined ||
        2 * props.noContextLines >= lines.length
      ) {
        return text;
      } else {
        const startChunk = lines.slice(0, props.noContextLines).join('\n');
        const endChunk = lines
          .slice(lines.length - props.noContextLines + 1, lines.length)
          .join('\n');

        const numLinesHidden = lines.length - 2 * props.noContextLines;
        return (
          <>
            {!isFirstSpan || hasNoHighlights ? startChunk : ''}
            <Flex
              w="100%"
              p={2}
              fontFamily="body"
              fontSize="xs"
              alignItems="center"
              gridGap={4}
              opacity={0.4}
              m={4}
            >
              <Box whiteSpace="nowrap">
                {numLinesHidden} line{numLinesHidden !== 1 ? 's' : null} not
                shown
              </Box>
              <Divider />
              <ButtonGroup
                variant="ghost"
                colorScheme="gray"
                size="xs"
                spacing={2}
                alignItems="center"
              >
                <Button
                  onClick={props.onClickLess}
                  disabled={props.isDisabledLess}
                >
                  Less
                </Button>
                <Button onClick={props.onClickMore}>More</Button>
              </ButtonGroup>
            </Flex>
            {/* Only truncate on one side if at end of text */}
            {!isLastSpan ? endChunk : ''}
          </>
        );
      }
    };

    return (
      <Tooltip hasArrow key={span.start} label={getTooltip(span)}>
        <Text
          as="span"
          bg={getColor(span.tags, props.palette)}
          fontFamily="mono"
          _hover={{
            opacity: 0.8,
          }}
        >
          {format(textContent)}
        </Text>
      </Tooltip>
    );
  });
  return (
    <Box margin={4} padding={4} whiteSpace="pre-wrap">
      {toDisplay}
    </Box>
  );
};

export default HighlightedText;
