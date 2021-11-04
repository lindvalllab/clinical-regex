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
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import AnnotationSidebar from './AnnotationSidebar';
import AnnotationFooter from './AnnotationFooter';
import { useHistory, useLocation } from 'react-router-dom';
import { ColorPaletteContext } from '../../ColorPaletteProvider';
import RedirectHome from '../../components/RedirectHome';
import { getUnique } from '../../../utils';
import {
  DEFAULT_CONTEXT_WINDOW_SIZE,
  CONTEXT_WINDOW_SIZE_OPTIONS,
} from './constants';

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
  const { paletteFromLabels } = useContext(ColorPaletteContext);
  const [contextWindow, setContextWindow] = useState<number>(
    DEFAULT_CONTEXT_WINDOW_SIZE
  );

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

  function skipPages(skippedPages: number) {
    return () => {
      if (page !== clipPage(page + skippedPages)) {
        setEntry(undefined);
        setHighlights(undefined);
        history.push(
          `/annotation-interface?page=${clipPage(page + skippedPages)}`
        );
      }
    };
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
    api
      .getSettings()
      .then((settings) => {
        setSettings(settings);
      })
      .catch((e) => {
        if (/no settings found/i.test(e.message)) {
          // No settings means that the project has not been initialized properly.
          setSettings(undefined);
        } else {
          console.error(e);
        }
      });
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

  if (settings === undefined) return <RedirectHome />;

  const uniqueLabels = getUnique(
    labels.sort((e) => e.id).map((label) => label.name)
  );
  const matchedLabels =
    highlights === undefined
      ? new Set()
      : new Set(
          Object.values(highlights)
            .flat()
            .map((x) => x.tag)
        );
  const matched = uniqueLabels.map((label) => matchedLabels.has(label));

  return (
    <Flex flexDirection="column" h="full" w="full">
      {entry && labels && highlights ? (
        <HStack alignItems="flex-start" maxW="100vw">
          <Box w="80vw" pl={8} pr={4} mt={4}>
            <Flex justifyContent="flex-start" mb={4} p={4} borderWidth={1}>
              <Stat>
                <StatLabel>Entry</StatLabel>
                <StatNumber>{page + 1}</StatNumber>
                <StatHelpText>out of {groupIds.length} in project</StatHelpText>
              </Stat>
              <Stat overflowX="hidden">
                <StatLabel>Group ID</StatLabel>
                <Tooltip label={groupIds[page]} placement="bottom-start">
                  <StatNumber isTruncated>{groupIds[page]}</StatNumber>
                </Tooltip>
                <StatHelpText>{settings?.GROUP_ID_FIELD}</StatHelpText>
              </Stat>
            </Flex>
            <EntryDisplay
              entry={entry}
              labels={labels}
              highlights={highlights}
              palette={paletteFromLabels(labels)}
              contextWindow={contextWindow}
            />
          </Box>
          <AnnotationSidebar
            entry={entry}
            labels={uniqueLabels}
            matched={matched}
            palette={paletteFromLabels(labels)}
            nextPage={skipPages(1)}
          />
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
        onPrevPage={skipPages(-1)}
        onNextPage={skipPages(1)}
        contextWindow={contextWindow}
        setContextWindow={setContextWindow}
        CONTEXT_WINDOW_SIZE_OPTIONS={CONTEXT_WINDOW_SIZE_OPTIONS}
      />
    </Flex>
  );
}

export default AnnotationInterface;
