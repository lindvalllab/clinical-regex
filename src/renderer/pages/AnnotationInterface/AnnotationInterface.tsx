import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import EntryDisplay from '../../components/EntryDisplay';
import { Entry } from '../../../types';
import { Box } from '@chakra-ui/layout';
import { Button, SkeletonText } from '@chakra-ui/react';
import styled from '@emotion/styled';

const Header = styled.div`
  background-color: lightgray;
  color: black;
  display: flex;
  justify-content: space-between;
  padding: 1em;
`;

function AnnotationInterface(): JSX.Element {
  const api = useContext(ApiContext);
  const onClick = async () => {
    console.log('Button clicked');
    const result = await api.getAllTexts();
    console.log(result);
  };

  const [page, setPage] = useState<number>(0);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [entry, setEntry] = useState<Entry>();

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
      setEntry(entry);
    });
  }, [api, groupIds, page]);

  return (
    <Box>
      <Button onClick={onClick}>Log all Text objects to console</Button>
      <Header>
        <span>
          Entry: {page + 1} / {groupIds !== undefined ? groupIds.length : ''}
        </span>
        <span>Group ID: {groupIds !== undefined ? groupIds[page] : '?'}</span>
      </Header>
      {entry ? (
        <EntryDisplay entry={entry} />
      ) : (
        <SkeletonText noOfLines={12} spacing={4} />
      )}
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
    </Box>
  );
}

export default AnnotationInterface;
