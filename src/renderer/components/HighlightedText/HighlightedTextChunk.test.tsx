import { render, screen } from '@testing-library/react';
import HighlightedTextChunk from './HighlightedTextChunk';

test('renders full text when contextWindow is -1', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={false}
      isOnlySpan={false}
      contextWindow={-1}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(
    /This is an example text for testing HighlightedTextChunk./i
  );
  expect(text).toBeInTheDocument();
});

test('truncates the text correctly (when relevant)', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={false}
      isOnlySpan={false}
      contextWindow={2}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const startChunk = screen.getByText(/This is .../i);
  const endChunk = screen.getByText(/... testing HighlightedTextChunk/i);
  expect(startChunk).toBeInTheDocument();
  expect(endChunk).toBeInTheDocument();
});

test('renders full text regardless of contextWindow when isHighlight', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={true}
      isOnlySpan={false}
      contextWindow={2}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(
    /This is an example text for testing HighlightedTextChunk./i
  );
  expect(text).toBeInTheDocument();
});
