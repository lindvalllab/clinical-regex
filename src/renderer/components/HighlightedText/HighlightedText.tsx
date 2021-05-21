import c_c from 'color-mixer';
import styled from '@emotion/styled';
import flattenSpans from './flattenSpans';
import { SpanWithTag, SpanWithTags } from '../../../types';
import { Tooltip } from '@chakra-ui/tooltip';
import { Text } from '@chakra-ui/layout';

const Container = styled.div`
  margin: 1em;
  padding: 1em;
  white-space: pre-wrap;
`;

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
};

const getColor = (tags: string[], palette: Record<string, string>) => {
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

  const toDisplay = resolvedSpans.map((span) => {
    return (
      <Tooltip hasArrow key={span.start} label={getTooltip(span)}>
        <Text as="span" bg={getColor(span.tags, props.palette)}>
          {props.text.slice(span.start, span.start + span.length)}
        </Text>
      </Tooltip>
    );
  });
  return <Container>{toDisplay}</Container>;
};

export default HighlightedText;
