import { useEffect, useState } from 'react';
import { api } from '../api';
import './TextDisplay.css';

function TextDisplay(): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const [texts, setTexts] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  // Get the list of groupIds on initial render.
  useEffect(() => {
    api.getAllGroupIds().then((ids) => {
      setGroupIds(ids);
    });
  }, []);

  // Get the next set of texts when the page changes.
  useEffect(() => {
    if (groupIds.length === 0) return;
    const groupId = groupIds[page];
    api.getEntry(groupId).then((entry) => {
      setTexts(entry.texts.map((textObj) => textObj.text));
    });
  }, [groupIds, page]);

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

  function displayedTexts(txs: string[]): (string | JSX.Element)[] {
    const out = [];
    for (let i = 0; i < txs.length; i++) {
      if (i !== 0) {
        out.push(<hr key={i} />);
      }
      out.push(txs[i]);
    }
    return out;
  }

  return (
    <div>
      <div className="textArea">
        {'Page: '} {page + 1} {'/'}{' '}
        {groupIds !== undefined ? groupIds.length : ''} <br />
        {'Group ID:'} {groupIds !== undefined ? groupIds[page] : '?'}
        <br />
        {displayedTexts(texts)}
      </div>
      <div>
        <button onClick={incrementPage(-1)} disabled={page === 0}>
          {'<-'}
        </button>
        <button
          onClick={incrementPage(1)}
          disabled={page === groupIds.length - 1}
        >
          {'->'}
        </button>
      </div>
    </div>
  );
}

export default TextDisplay;
