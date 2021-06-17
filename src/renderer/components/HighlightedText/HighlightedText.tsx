import flattenSpans from './flattenSpans';
import { SpanWithTag } from '../../../types';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
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
import HighlightedTextChunk from './HighlightedTextChunk';

const MIN_CONTEXT_WINDOW_SIZE = CONTEXT_WINDOW_SIZE_OPTIONS.Tiny;
const MAX_CONTEXT_WINDOW_SIZE = CONTEXT_WINDOW_SIZE_OPTIONS.All;

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
    const isHighlight = span.tags.length > 0;

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
          <HighlightedTextChunk
            isFirstSpan={index === 0}
            isLastSpan={index === resolvedSpans.length - 1}
            isHighlight={isHighlight}
            text={props.text.slice(span.start, span.start + span.length)}
            isOnlySpan={hasNoHighlights}
            contextWindow={contextWindow[index]}
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
        </Text>
      </Tooltip>
    );
  });
  return (
    <Box p={isHidden ? 1 : 4} maxW="100%">
      <Flex
        justifyContent={isHidden ? 'space-between' : 'flex-end'}
        alignItems="center"
        gridGap={2}
        maxW="100%"
      >
        {isHidden ? (
          <Flex alignItems="center" gridGap={1} maxW="75%">
            {uniqueTags.map((tag) => (
              <Tooltip key={tag} label={tag}>
                <Badge bg={props.palette[tag]} cursor="pointer" boxSize={2} />
              </Tooltip>
            ))}
            <Text
              isTruncated
              fontSize="xs"
              fontFamily="mono"
              color="darkgray"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              px={4}
              maxW="100%"
            >
              {props.text}
            </Text>
          </Flex>
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
            onClick={() =>
              setContextWindow(fillContextWindowArray(MAX_CONTEXT_WINDOW_SIZE))
            }
            disabled={contextWindow.every((v) => v === MAX_CONTEXT_WINDOW_SIZE)}
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
