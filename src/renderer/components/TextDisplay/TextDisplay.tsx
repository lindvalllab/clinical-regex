import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../api';
import HighlightedText from '../HighlightedText';
import styled from '@emotion/styled';

const Container = styled.div`
  background-color: gray;
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 80vw;
`;

const TextsContainer = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: lightgray;
  color: black;
  display: flex;
  justify-content: space-between;
  padding: 1em;
`;

function TextDisplay(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [texts, setTexts] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const api = useContext(ApiContext);

  // Get the list of groupIds on initial render.
  useEffect(() => {
    api
      .getAllGroupIds()
      .then((ids) => {
        setGroupIds(ids);
      })
      .catch((e) => console.error(e));
  }, [api]);

  // Get the next set of texts when the page changes.
  useEffect(() => {
    if (groupIds.length === 0) return;
    const groupId = groupIds[page];
    api.getEntry(groupId).then((entry) => {
      setTexts(entry.texts.map((textObj) => textObj.text));
    });
  }, [api, groupIds, page]);

  function clipPage(index: number) {
    if (index < 0) {
      return 0;
    }
    if (index >= groupIds.length) {
      return groupIds.length - 1;
    }
    return index;
  }

  function incrementPage(amount: number) {
    return () => setPage((oldPage) => clipPage(oldPage + amount));
  }

  function entryDisplay(texts: string[]): JSX.Element[] {
    const highlights = [
      {
        start: 0,
        length: 12,
        tag: 'Foo',
      },
      {
        start: 5,
        length: 12,
        tag: 'Bar',
      },
    ];

    const palette = {
      Foo: '#4089ff',
      Bar: '#f302fe',
    };
    return texts.map((text, index) => (
      <HighlightedText
        key={index}
        text={text}
        highlights={highlights}
        palette={palette}
      />
    ));
  }

  return (
    <Container>
      <Header>
        <span>
          Entry: {page + 1} / {groupIds !== undefined ? groupIds.length : ''}
        </span>
        <span>Group ID: {groupIds !== undefined ? groupIds[page] : '?'}</span>
      </Header>
      <TextsContainer>{entryDisplay(texts)}</TextsContainer>
      <div>
        <button onClick={incrementPage(-1)} disabled={page === 0}>
          Prev
        </button>
        <button
          onClick={incrementPage(1)}
          disabled={page === groupIds.length - 1}
        >
          Next
        </button>
      </div>
    </Container>
  );
}

export default TextDisplay;
