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
      contextWindow={2}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const startChunk = screen.getByText(/This is \.\.\./i);
  const endChunk = screen.getByText(/\.\.\. testing HighlightedTextChunk/i);
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

test('displays the correct number of words hidden when truncated', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={false}
      contextWindow={2}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(/4 words not shown/i);
  expect(text).toBeInTheDocument();
});

test('uses the singular when number of words hidden is 1', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is a second example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={false}
      contextWindow={4}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(/1 word not shown/i);
  expect(text).toBeInTheDocument();
});

test('truncates only from end when isFirstSpan && isLastSpan', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={true}
      isLastSpan={true}
      isHighlight={false}
      contextWindow={4}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(/This is an example .../i);
  expect(text).toBeInTheDocument();
});

test('truncates only from start when isFirstSpan && !isLastSpan', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={true}
      isLastSpan={false}
      isHighlight={false}
      contextWindow={4}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(
    /\.\.\. text for testing HighlightedTextChunk./i
  );
  expect(text).toBeInTheDocument();
});

test('truncates only from end when !isFirstSpan && isLastSpan', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={true}
      isHighlight={false}
      contextWindow={4}
      onClickLess={onClickLess}
      onClickMore={onClickMore}
      isDisabledLess={false}
    />
  );
  const text = screen.getByText(/This is an example \.\.\./i);
  expect(text).toBeInTheDocument();
});

test('displays full text when contextWindow is >= half the text length', () => {
  const onClickLess = jest.fn();
  const onClickMore = jest.fn();

  render(
    <HighlightedTextChunk
      text="This is an example text for testing HighlightedTextChunk."
      isFirstSpan={false}
      isLastSpan={false}
      isHighlight={false}
      contextWindow={4}
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
