import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import EntryDisplay from '../../components/EntryDisplay';
import { Entry, LabelEntity } from '../../../types';
import {
  Center,
  Flex,
  Spacer,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import AnnotationFooter from './AnnotationFooter';

function AnnotationInterface(): JSX.Element {
  const api = useContext(ApiContext);

  const bg = useColorModeValue('white', 'gray.800');
  const [page, setPage] = useState<number>(0);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [labels, setLabels] = useState<LabelEntity[]>([]);
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

  // Get the groupIds and labels on initial render.
  useEffect(() => {
    api
      .getAllGroupIds()
      .then((ids) => {
        setGroupIds(ids);
      })
      .catch((e) => console.error(e));
    api
      .getAllLabels()
      .then((labels) => {
        setLabels(labels);
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

  // this will have to be changed later
  const groupIdField = 'SUBJECT_ID';

  return (
    <Flex flexDirection="column" height="100%">
      {entry ? (
        <EntryDisplay entry={entry} labels={labels} />
      ) : (
        <Center w="full" h="full" bg={bg}>
          <Spinner
            thickness="4px"
            size="xl"
            speed="0.65s"
            color="gray"
            bg="transparent"
          />
        </Center>
      )}
      <Spacer />
      <AnnotationFooter
        page={page}
        totalPages={groupIds.length}
        groupId={groupIds[page]}
        groupIdField={groupIdField}
        onPrevPage={incrementPage(-1)}
        onNextPage={incrementPage(1)}
      />
    </Flex>
  );
}

export default AnnotationInterface;
