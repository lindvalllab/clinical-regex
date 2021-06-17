import DividerClamp from './DividerClamp';

type HighlightedTextChunkProps = {
  text: string;
  isFirstSpan: boolean;
  isLastSpan: boolean;
  isHighlight: boolean;
  contextWindow: number;
  onClickLess: () => void;
  onClickMore: () => void;
  isDisabledLess: boolean;
  clamp?: string;
};

const HighlightedTextChunk = ({
  text,
  isFirstSpan,
  isLastSpan,
  isHighlight,
  contextWindow,
  onClickLess,
  onClickMore,
  isDisabledLess,
  clamp,
}: HighlightedTextChunkProps): JSX.Element => {
  if (isHighlight || contextWindow <= 0) return <>{text}</>;

  if (clamp === undefined) {
    clamp = '...';
  }

  const isOnlySpan = isFirstSpan && isLastSpan;

  // split() will return the delimiters as odd array items
  // if wrapped in parentheses
  const words = text.split(/(\s+)/);

  // divide by 2 to avoid counting delimiter elements
  // first and last spans only get truncated from one side
  const numWordsHidden =
    (words.length + (words.length % 2)) / 2 -
    (isFirstSpan || isLastSpan ? 1 : 2) * contextWindow;

  if (numWordsHidden <= 0) {
    return <>{text}</>;
  }

  const startChunk = words.slice(0, 2 * contextWindow).join('');
  const endChunk = words
    .slice(words.length - 2 * contextWindow + 1, words.length)
    .join('');

  return (
    <>
      {!isFirstSpan || isOnlySpan ? `${startChunk} ${clamp}` : ''}
      <DividerClamp
        number={numWordsHidden}
        onClickLess={onClickLess}
        onClickMore={onClickMore}
        isDisabledLess={isDisabledLess}
        m={4}
      />
      {/* Only truncate on one side if at end of text */}
      {!isLastSpan ? `${clamp} ${endChunk}` : ''}
    </>
  );
};

export default HighlightedTextChunk;
