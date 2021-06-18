import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import EntryDisplay from '../../components/EntryDisplay';
import { Entry, LabelEntity, SettingsEntity } from '../../../types';
import {
  Box,
  Center,
  Flex,
  HStack,
  Spacer,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import AnnotationSidebar from './AnnotationSidebar';
import AnnotationFooter from './AnnotationFooter';
import { useHistory, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function AnnotationInterface(): JSX.Element {
  const api = useContext(ApiContext);
  const query = useQuery();
  const history = useHistory();

  const bg = useColorModeValue('white', 'gray.800');
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [labels, setLabels] = useState<LabelEntity[]>([]);
  const [settings, setSettings] = useState<SettingsEntity>();
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

  const page = clipPage(Number(query.get('page')));

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
    api
      .getSettings()
      .then((settings) => {
        setSettings(settings);
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
    <Flex flexDirection="column" h="full" w="full">
      {entry && labels ? (
        <HStack alignItems="start" maxW="100vw">
          <Box w="80vw">
            <EntryDisplay entry={entry} labels={labels} />
          </Box>
          <AnnotationSidebar entry={entry} labels={labels} />
        </HStack>
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
        groupIdField={settings?.GROUP_ID_FIELD}
        onPrevPage={() =>
          history.push(`/annotation-interface?page=${page - 1}`)
        }
        onNextPage={() =>
          history.push(`/annotation-interface?page=${page + 1}`)
        }
      />
    </Flex>
  );
}

export default AnnotationInterface;
