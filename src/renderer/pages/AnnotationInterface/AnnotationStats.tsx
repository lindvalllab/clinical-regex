import {
  CircularProgress,
  Flex,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

type AnnotationStatsProps = {
  page: number;
  isAnnotated: boolean;
  groupIds: string[];
  groupIdField: string | null;
  numAnnotated: number;
  numAnnotatedWithMatches: number;
  totalEntriesWithMatches: number;
};

function AnnotationStats({
  page,
  isAnnotated,
  groupIds,
  groupIdField,
  numAnnotated,
  numAnnotatedWithMatches,
  totalEntriesWithMatches,
}: AnnotationStatsProps): JSX.Element {
  const percentAnnotatedAll = (numAnnotated / groupIds.length) * 100;
  const percentAnnotatedWithMatches =
    (numAnnotatedWithMatches / totalEntriesWithMatches) * 100;
  return (
    <Flex justifyContent="flex-start" mb={4} p={4} borderWidth={1} gridGap={4}>
      <Stat>
        <StatLabel>Entry</StatLabel>
        <Flex alignItems="center" gridGap={2}>
          <StatNumber>{page + 1}</StatNumber>
          {isAnnotated ? (
            <Tooltip label="This entry has been annotated" placement="right">
              <span>
                <Icon as={FaCheckCircle} color="green.500" />
              </span>
            </Tooltip>
          ) : (
            <Tooltip
              label="This entry has not been annotated"
              placement="right"
            >
              <span>
                <Icon as={FaCheckCircle} color="gray" opacity={0.3} />
              </span>
            </Tooltip>
          )}
        </Flex>
        <StatHelpText>out of {groupIds.length}</StatHelpText>
      </Stat>
      <Stat overflowX="hidden">
        <StatLabel>Group ID</StatLabel>
        <Tooltip label={groupIds[page]} placement="bottom-start">
          <StatNumber isTruncated>{groupIds[page]}</StatNumber>
        </Tooltip>
        <StatHelpText>{groupIdField}</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>% annotated</StatLabel>
        <Flex alignItems="center">
          <CircularProgress
            value={percentAnnotatedAll}
            thickness="12px"
            color="blue.500"
            size={6}
            mr={2}
          />
          <StatNumber>{percentAnnotatedAll.toFixed(0)}%</StatNumber>
        </Flex>
        <StatHelpText>
          of all entries ({numAnnotated}/{groupIds.length})
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>% annotated</StatLabel>
        <Flex alignItems="center">
          <CircularProgress
            value={percentAnnotatedWithMatches}
            thickness="12px"
            color="red.500"
            size={6}
            mr={2}
          />
          <StatNumber>{percentAnnotatedWithMatches.toFixed(0)}%</StatNumber>
        </Flex>
        <StatHelpText>
          of entries with keyword matches ({numAnnotatedWithMatches}/
          {totalEntriesWithMatches})
        </StatHelpText>
      </Stat>
    </Flex>
  );
}

export default AnnotationStats;
