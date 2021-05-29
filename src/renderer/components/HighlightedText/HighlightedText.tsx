import flattenSpans from './flattenSpans';
import { SpanWithTag } from '../../../types';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import DividerClamp from './DividerClamp';
import { getColor, getTooltip, isValidContextLinesValue } from './utils';

const CONTEXT_INCREMENT_SIZE = 2;

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
  contextLines: number;
};

const HighlightedText = (props: HighlightedTextProps): JSX.Element => {
  const resolvedSpans = flattenSpans(props.text, props.highlights);
  const hasNoHighlights =
    resolvedSpans.length === 1 && resolvedSpans[0].tags.length === 0;

  const [contextLines, setContextLines] = useState<number[]>(
    Array(resolvedSpans.length).fill(props.contextLines)
  );

  useEffect(() => {
    setContextLines(Array(resolvedSpans.length).fill(props.contextLines));
  }, [props.contextLines, resolvedSpans.length]);

  const updateContextLines = (index: number, newValue: number) => {
    setContextLines((prevState) => {
      const updated = [...prevState];
      // don't change value if newValue <= 0
      updated[index] = !isValidContextLinesValue(newValue)
        ? updated[index]
        : newValue;
      return updated;
    });
  };

  const toDisplay = resolvedSpans.map((span, index) => {
    const isFirstSpan = index === 0;
    const isLastSpan = index === resolvedSpans.length - 1;
    const isHighlight = span.tags.length !== 0;
    const textContent = props.text.slice(span.start, span.start + span.length);

    const format = (text: string): ReactNode => {
      const lines = text.split('\n');
      const numLinesHidden = lines.length - 2 * contextLines[index];

      if (isHighlight || numLinesHidden <= 0 || contextLines[index] <= 0) {
        return text;
      } else {
        const startChunk = lines.slice(0, contextLines[index]).join('\n');
        const endChunk = lines
          .slice(lines.length - contextLines[index] + 1, lines.length)
          .join('\n');

        return (
          <>
            {!isFirstSpan || hasNoHighlights ? startChunk : ''}
            <DividerClamp
              numLines={numLinesHidden}
              onClickLess={() =>
                updateContextLines(
                  index,
                  contextLines[index] - CONTEXT_INCREMENT_SIZE
                )
              }
              onClickMore={() =>
                updateContextLines(
                  index,
                  contextLines[index] + CONTEXT_INCREMENT_SIZE
                )
              }
              isDisabledLess={
                !isValidContextLinesValue(
                  contextLines[index] - CONTEXT_INCREMENT_SIZE
                )
              }
            />
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
            opacity: isHighlight ? 0.8 : 1,
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
