import flattenSpans from './flattenSpans';
import { SpanWithTag } from '../../../types';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import DividerClamp from './DividerClamp';
import { getColor, getTooltip, isValidContextWindowValue } from './utils';
import { CONTEXT_INCREMENT_SIZE } from './constants';

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
  contextWindow: number;
};

const HighlightedText = (props: HighlightedTextProps): JSX.Element => {
  const resolvedSpans = flattenSpans(props.text, props.highlights);
  const hasNoHighlights =
    resolvedSpans.length === 1 && resolvedSpans[0].tags.length === 0;

  const [contextWindow, setContextWindow] = useState<number[]>(
    Array(resolvedSpans.length).fill(props.contextWindow)
  );

  // reset context windows when props.contextWindow changes
  // would be nice to not repeat the Array(resolvedSpans.length).fill(props.contextWindow)
  // part, not sure how to do that, though...
  useEffect(() => {
    setContextWindow(Array(resolvedSpans.length).fill(props.contextWindow));
  }, [props.contextWindow, resolvedSpans.length]);

  const updateContextWindow = (index: number, newValue: number) => {
    setContextWindow((prevState) => {
      const updated = [...prevState];
      // don't change value if newValue <= 0
      updated[index] = !isValidContextWindowValue(newValue)
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
      // split() will return the delimiters as odd array items
      // if wrapped in parentheses
      const words = text.split(/(\s+)/);

      // divide by 2 to avoid counting delimiter elements
      // first and last spans only get truncated from one side
      const numHidden =
        (words.length + (words.length % 2)) / 2 -
        (isFirstSpan || isLastSpan ? 1 : 2) * contextWindow[index];

      if (isHighlight || numHidden <= 0 || contextWindow[index] <= 0) {
        return text;
      } else {
        const startChunk = words.slice(0, 2 * contextWindow[index]).join('');
        const endChunk = words
          .slice(words.length - 2 * contextWindow[index] + 1, words.length)
          .join('');

        return (
          <>
            {!isFirstSpan || hasNoHighlights ? `${startChunk} ...` : ''}
            <DividerClamp
              number={numHidden}
              onClickLess={() =>
                updateContextWindow(
                  index,
                  contextWindow[index] - CONTEXT_INCREMENT_SIZE
                )
              }
              onClickMore={() =>
                updateContextWindow(
                  index,
                  contextWindow[index] + CONTEXT_INCREMENT_SIZE
                )
              }
              isDisabledLess={
                !isValidContextWindowValue(
                  contextWindow[index] - CONTEXT_INCREMENT_SIZE
                )
              }
            />
            {/* Only truncate on one side if at end of text */}
            {!isLastSpan ? `... ${endChunk}` : ''}
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
            cursor: isHighlight ? 'pointer' : undefined,
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
