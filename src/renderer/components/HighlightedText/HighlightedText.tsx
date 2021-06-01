import flattenSpans from './flattenSpans';
import { SpanWithTag } from '../../../types';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Icon,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import DividerClamp from './DividerClamp';
import {
  getColor,
  getTooltip,
  getUnique,
  isValidContextWindowValue,
} from './utils';
import {
  CONTEXT_INCREMENT_SIZE,
  CONTEXT_WINDOW_SIZE_OPTIONS,
} from './constants';
import { FaCircle } from 'react-icons/fa';

const MIN_CONTEXT_WINDOW_SIZE = CONTEXT_WINDOW_SIZE_OPTIONS['Tiny'];

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
  contextWindow: number;
  isHidden?: boolean;
};

const HighlightedText = (props: HighlightedTextProps): JSX.Element => {
  const resolvedSpans = flattenSpans(props.text, props.highlights);
  const hasNoHighlights =
    resolvedSpans.length === 1 && resolvedSpans[0].tags.length === 0;

  const uniqueTags = hasNoHighlights
    ? []
    : getUnique(resolvedSpans.map((span) => span.tags).flat()).sort();

  const fillContextWindowArray = useCallback(
    (value: number): number[] => {
      return Array(resolvedSpans.length).fill(value);
    },
    [resolvedSpans.length]
  );

  const [contextWindow, setContextWindow] = useState<number[]>(
    fillContextWindowArray(props.contextWindow)
  );

  const [isHidden, setIsHidden] = useState(props.isHidden || false);

  // reset context windows when props.contextWindow changes
  useEffect(() => {
    setContextWindow(fillContextWindowArray(props.contextWindow));
  }, [props.contextWindow, fillContextWindowArray]);

  useEffect(() => {
    if (props.isHidden) {
      setIsHidden(props.isHidden);
    }
  }, [props.isHidden]);

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
    <Box p={4}>
      <Flex justifyContent="flex-end" alignItems="center" gridGap={4}>
        {isHidden ? (
          <>
            {uniqueTags.map((tag) => (
              <Tooltip key={tag} label={tag}>
                {/* From https://chakra-ui.com/docs/overlay/tooltip:
                Note 🚨: If you're wrapping an icon from react-icons,
                you need to also wrap the icon in a span element as
                react-icons icons do not use forwardRef. */}
                <span>
                  <Icon
                    as={FaCircle}
                    boxSize={2}
                    color={props.palette[tag]}
                    cursor="pointer"
                  />
                </span>
              </Tooltip>
            ))}
            <Text
              isTruncated
              fontSize="sm"
              fontFamily="mono"
              color="darkgray"
              px={4}
            >
              {props.text}
            </Text>
          </>
        ) : (
          <></>
        )}
        <ButtonGroup
          size="xs"
          variant="outline"
          colorScheme="gray"
          display={isHidden ? 'none' : undefined}
        >
          <Button
            onClick={() =>
              setContextWindow(fillContextWindowArray(MIN_CONTEXT_WINDOW_SIZE))
            }
            disabled={contextWindow.every((v) => v === MIN_CONTEXT_WINDOW_SIZE)}
          >
            Collapse All
          </Button>
          <Button
            onClick={() => setContextWindow(fillContextWindowArray(-1))}
            disabled={contextWindow.every((v) => v === -1)}
          >
            Expand All
          </Button>
        </ButtonGroup>
        <Checkbox
          size="sm"
          isChecked={isHidden}
          onChange={() => setIsHidden(!isHidden)}
        >
          Hide
        </Checkbox>
      </Flex>
      {!isHidden ? (
        <Box margin={4} padding={4} whiteSpace="pre-wrap">
          {toDisplay}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default HighlightedText;
