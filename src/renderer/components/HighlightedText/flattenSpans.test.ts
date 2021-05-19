import { SpanWithTag, SpanWithTags } from '../../../types';
import flattenSpans from './flattenSpans';

describe('flattenSpans', () => {
  it('Builds expected list for a basic example', () => {
    const text = 'This is a sample text.';
    const highlights: SpanWithTag[] = [
      {
        start: 0,
        length: 3,
        tag: 'foo',
      },
      {
        start: 2,
        length: 5,
        tag: 'bar',
      },
    ];

    const expected: SpanWithTags[] = [
      {
        start: 0,
        length: 2,
        tags: ['foo'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
        ],
      },
      {
        start: 2,
        length: 1,
        tags: ['foo', 'bar'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
          {
            start: 2,
            length: 5,
            tag: 'bar',
          },
        ],
      },
      {
        start: 3,
        length: 4,
        tags: ['bar'],
        entities: [
          {
            start: 2,
            length: 5,
            tag: 'bar',
          },
        ],
      },
      {
        start: 7,
        length: 15,
        tags: [],
        entities: [],
      },
    ];

    const flattenedSpans = flattenSpans(text, highlights);

    expect(flattenedSpans).toEqual(expected);
  });

  it('Automatically resolves spans that extend past the length of the text', () => {
    const text = 'This is a sample text.';
    const highlights: SpanWithTag[] = [
      {
        start: 0,
        length: 3,
        tag: 'foo',
      },
      {
        start: 2,
        length: 100,
        tag: 'bar',
      },
    ];
    const expected: SpanWithTags[] = [
      {
        start: 0,
        length: 2,
        tags: ['foo'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
        ],
      },
      {
        start: 2,
        length: 1,
        tags: ['foo', 'bar'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
          {
            start: 2,
            length: 100,
            tag: 'bar',
          },
        ],
      },
      {
        start: 3,
        length: 19,
        tags: ['bar'],
        entities: [
          {
            start: 2,
            length: 100,
            tag: 'bar',
          },
        ],
      },
    ];

    const flattenedSpans = flattenSpans(text, highlights);
    expect(flattenedSpans).toEqual(expected);
  });

  it('Throws an error if a tag is not a string', () => {
    const text = 'This is a sample text.';
    const highlights = [
      {
        start: 0,
        length: 3,
        tag: 1,
      },
    ];

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flattenSpans(text, highlights as any);
    }).toThrowError();
  });
  it('Merges overlapping spans with the same tags', () => {
    const text = 'This is a sample text.';
    const highlights: SpanWithTag[] = [
      {
        start: 0,
        length: 3,
        tag: 'foo',
      },
      {
        start: 2,
        length: 5,
        tag: 'foo',
      },
    ];

    const expected: SpanWithTags[] = [
      {
        start: 0,
        length: 7,
        tags: ['foo'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
          {
            start: 2,
            length: 5,
            tag: 'foo',
          },
        ],
      },
      {
        start: 7,
        length: 15,
        tags: [],
        entities: [],
      },
    ];

    const flattenedSpans = flattenSpans(text, highlights);
    expect(flattenedSpans).toEqual(expected);
  });
  it('Merges overlapping spans with the same for a more complicated case', () => {
    const text = 'This is a sample text.';
    const highlights: SpanWithTag[] = [
      {
        start: 0,
        length: 7,
        tag: 'A',
      },
      {
        start: 2,
        length: 12,
        tag: 'B',
      },
      {
        start: 5,
        length: 5,
        tag: 'D',
      },
      {
        start: 12,
        length: 7,
        tag: 'C',
      },
    ];

    const expected: SpanWithTags[] = [
      {
        start: 0,
        length: 2,
        tags: ['A'],
        entities: [
          {
            start: 0,
            length: 7,
            tag: 'A',
          },
        ],
      },
      {
        start: 2,
        length: 3,
        tags: ['A', 'B'],
        entities: [
          {
            start: 0,
            length: 7,
            tag: 'A',
          },
          {
            start: 2,
            length: 12,
            tag: 'B',
          },
        ],
      },
      {
        start: 5,
        length: 2,
        tags: ['A', 'B', 'D'],
        entities: [
          {
            start: 0,
            length: 7,
            tag: 'A',
          },
          {
            start: 2,
            length: 12,
            tag: 'B',
          },
          {
            start: 5,
            length: 5,
            tag: 'D',
          },
        ],
      },
      {
        start: 7,
        length: 3,
        tags: ['B', 'D'],
        entities: [
          {
            start: 2,
            length: 12,
            tag: 'B',
          },
          {
            start: 5,
            length: 5,
            tag: 'D',
          },
        ],
      },
      {
        start: 10,
        length: 2,
        tags: ['B'],
        entities: [
          {
            start: 2,
            length: 12,
            tag: 'B',
          },
        ],
      },
      {
        start: 12,
        length: 2,
        tags: ['B', 'C'],
        entities: [
          {
            start: 2,
            length: 12,
            tag: 'B',
          },
          {
            start: 12,
            length: 7,
            tag: 'C',
          },
        ],
      },
      {
        start: 14,
        length: 5,
        tags: ['C'],
        entities: [
          {
            start: 12,
            length: 7,
            tag: 'C',
          },
        ],
      },
      {
        start: 19,
        length: 3,
        tags: [],
        entities: [],
      },
    ];

    const flattenedSpans = flattenSpans(text, highlights);
    expect(flattenedSpans).toEqual(expected);
  });
  it('Works if the entities are provided "out of order"', () => {
    const text = 'This is a sample text.';
    const highlights: SpanWithTag[] = [
      {
        start: 2,
        length: 5,
        tag: 'bar',
      },
      {
        start: 0,
        length: 3,
        tag: 'foo',
      },
    ];

    const expected: SpanWithTags[] = [
      {
        start: 0,
        length: 2,
        tags: ['foo'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
        ],
      },
      {
        start: 2,
        length: 1,
        tags: ['foo', 'bar'],
        entities: [
          {
            start: 0,
            length: 3,
            tag: 'foo',
          },
          {
            start: 2,
            length: 5,
            tag: 'bar',
          },
        ],
      },
      {
        start: 3,
        length: 4,
        tags: ['bar'],
        entities: [
          {
            start: 2,
            length: 5,
            tag: 'bar',
          },
        ],
      },
      {
        start: 7,
        length: 15,
        tags: [],
        entities: [],
      },
    ];

    const flattenedSpans = flattenSpans(text, highlights);

    expect(flattenedSpans).toEqual(expected);
  });
});
