import c_c from 'color-mixer';
import styled from 'styled-components';
import flattenSpans from './flattenSpans';
import { SpanWithTag, SpanWithTags } from '../../../types';

const Container = styled.div`
  background: white;
  border: 2px solid white;
  color: black;
  margin: 1em;
  padding: 1em;
  white-space: pre-wrap;
`;

const Highlight = styled.mark`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background: ${(props) => props.color || 'white'};
`;

type HighlightedTextProps = {
  text: string;
  highlights: SpanWithTag[];
  palette: Record<string, string>;
};

const onMouseOver = (span: SpanWithTags) => {
  return () => console.log(span);
};

const getColor = (tags: string[], palette: Record<string, string>) => {
  if (tags.length === 0) {
    return undefined;
  }

  const colors = tags.map((tag: string) => {
    const color = palette[tag] ? palette[tag] : '#ffffff';
    return new c_c.Color({ hex: color });
  });

  if (colors.length === 1) {
    return colors[0].hex();
  } else if (colors.length > 1) {
    const color = new c_c.Color({ mix: colors });
    return color.hex();
  }

  return undefined;
};

const HighlightedText = (props: HighlightedTextProps): JSX.Element => {
  const resolvedSpans = flattenSpans(props.text, props.highlights);

  const toDisplay = resolvedSpans.map((span) => {
    return (
      <Highlight
        key={span.start}
        color={getColor(span.tags, props.palette)}
        onMouseOver={onMouseOver(span)}
      >
        {props.text.slice(span.start, span.start + span.length)}
      </Highlight>
    );
  });
  return <Container>{toDisplay}</Container>;
};

export default HighlightedText;
