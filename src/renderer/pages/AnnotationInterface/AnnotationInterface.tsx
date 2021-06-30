import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import EntryDisplay from '../../components/EntryDisplay';
import {
  Entry,
  LabelEntity,
  SettingsEntity,
  SpanWithTag,
} from '../../../types';
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
  const [highlights, setHighlights] =
    useState<{ [textId: number]: SpanWithTag[] }>();

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
    // current: Are the async effects from this useEffect hook relevant to the current page?
    // This allows us not to update state based on lingering promises from old pages.
    let current = true;
    if (groupIds.length === 0) return;
    const groupId = groupIds[page];
    const fetchedMatches: Promise<void>[] = [];
    api.getEntry(groupId).then((entry) => {
      const newHighlights: typeof highlights = {};
      for (const textEntity of entry.texts) {
        fetchedMatches.push(
          api.getMatchesByTextId(textEntity.id).then((matches) => {
            newHighlights[textEntity.id] = matches.map((match) => ({
              start: match.start,
              length: match.length,
              tag: match.label,
            }));
          })
        );
      }
      Promise.all(fetchedMatches).then(() => {
        if (current) {
          setHighlights(newHighlights);
          setEntry(entry);
        }
      });
    });
    return () => {
      current = false;
    };
  }, [api, groupIds, page]);

  return (
    <Flex flexDirection="column" h="full" w="full">
      {entry && labels && highlights ? (
        <HStack alignItems="start" maxW="100vw">
          <Box w="80vw">
            <EntryDisplay
              entry={entry}
              labels={labels}
              highlights={highlights}
            />
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
        onPrevPage={() => {
          setEntry(undefined);
          setHighlights(undefined);
          history.push(`/annotation-interface?page=${clipPage(page - 1)}`);
        }}
        onNextPage={() => {
          setEntry(undefined);
          setHighlights(undefined);
          history.push(`/annotation-interface?page=${clipPage(page + 1)}`);
        }}
      />
    </Flex>
  );
}

export default AnnotationInterface;
