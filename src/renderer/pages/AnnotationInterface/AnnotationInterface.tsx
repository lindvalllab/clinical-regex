import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import EntryDisplay from '../../components/EntryDisplay';
import { Entry } from '../../../types';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  SkeletonText,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

function AnnotationInterface(): JSX.Element {
  const api = useContext(ApiContext);

  const bg = useColorModeValue('white', 'gray.800');
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

  // this will have to be changed later
  const groupIdField = 'SUBJECT_ID';

  return (
    <Box>
      {entry ? (
        <EntryDisplay entry={entry} />
      ) : (
        <SkeletonText noOfLines={12} spacing={4} p={8} />
      )}
      <Flex
        w="100%"
        justify="space-between"
        position="sticky"
        bottom={0}
        bg={bg}
        py={4}
        px={6}
        borderTopWidth={1}
      >
        <Flex>
          <Grid
            templateColumns="repeat(2, 1fr)"
            templateRows="repeat(2, 1fr)"
            columnGap={4}
          >
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Entry
            </Text>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Group ID [{groupIdField}]
            </Text>
            <Text fontSize="md" fontWeight="extrabold">
              {page + 1} / {groupIds !== undefined ? groupIds.length : ''}
            </Text>
            <Text fontSize="md" fontWeight="extrabold">
              {groupIds !== undefined ? groupIds[page] : '?'}
            </Text>
          </Grid>
        </Flex>
        <ButtonGroup isAttached>
          <Button
            colorScheme="gray"
            onClick={incrementPage(-1)}
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            colorScheme="gray"
            onClick={incrementPage(1)}
            disabled={page === groupIds.length - 1}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
}

export default AnnotationInterface;
