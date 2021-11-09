import {
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Column, Row } from 'react-table';
import { ApiContext } from '../../api';
import {
  Box,
  Heading,
  Icon,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { DashboardEntry, LabelEntity } from '../../../types';
import DataTable from '../../components/DataTable';
import { useHistory } from 'react-router-dom';
import {
  ColorPaletteContext,
  ColorPaletteFromLabels,
} from '../../ColorPaletteProvider';
import RedirectHome from '../../components/RedirectHome';

function Dashboard(): JSX.Element {
  const api = useContext(ApiContext);
  const [labels, setLabels] = useState<LabelEntity[]>();
  const [groupIds, setGroupIds] = useState<string[]>();
  const [palette, setPalette] = useState<ColorPaletteFromLabels>();
  const [hasData, setHasData] = useState<boolean>(true);
  const { paletteFromLabels } = useContext(ColorPaletteContext);

  useEffect(() => {
    api.projectStarted().then((started) => setHasData(started));
  }, [api]);

  useEffect(() => {
    api.getAllLabels().then((labels) => setLabels(labels));
  }, [api]);

  useEffect(() => {
    api
      .getAllGroupIds({ orderByMatches: true })
      .then((ids) => setGroupIds(ids));
  }, [api]);

  useEffect(() => {
    if (labels) {
      setPalette(paletteFromLabels(labels));
    }
  }, [labels, paletteFromLabels]);

  const history = useHistory();
  const columns = useMemo<Column<DashboardEntry>[]>(
    () => [
      {
        Header: 'Group ID',
        accessor: 'group_id',
      },
      {
        Header: 'Keyword Matches',
        accessor: 'labels',
        Cell: ({ row }) =>
          row.original.labels.map((label, idx) => (
            <Tag
              m={0.5}
              key={idx}
              bgColor={palette && palette[label]}
              size="sm"
              fontFamily="mono"
              textTransform="uppercase"
              borderRadius="base"
              boxShadow="base"
            >
              {label}
            </Tag>
          )),
      },
      {
        Header: 'Total Matches',
        accessor: 'match_count',
      },
      {
        Header: 'Is Annotated',
        accessor: 'is_annotated',
        Cell: ({ row }) =>
          row.original.is_annotated ? (
            <Icon as={FaCheckCircle} color="green.500" />
          ) : (
            ''
          ),
      },
      {
        Header: 'Text',
        accessor: 'text',
        Cell: ({ row }) => (
          <Text
            isTruncated
            textOverflow="ellipsis"
            overflow="hidden"
            maxW="40vw"
          >
            {row.original.text}
          </Text>
        ),
      },
    ],
    [palette]
  );
  const [data, setData] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(
    async ({ pageIndex, pageSize }) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);

      if (fetchId === fetchIdRef.current) {
        const result = await api.getDashboardTable(pageIndex, pageSize);
        setData(result.results);
        setPageCount(Math.ceil(result.total / pageSize));
        setLoading(false);
        setTotalCount(result.total);
      }
    },
    [api]
  );

  const rowHoverColor = useColorModeValue('gray.100', 'gray.700');
  const onRowClick = (row: Row<DashboardEntry>) => {
    return () => {
      if (groupIds)
        history.push(
          `/annotation-interface?page=${groupIds.findIndex(
            (e) => e === row.original.group_id
          )}`
        );
    };
  };

  if (!hasData) return <RedirectHome />;

  return (
    <Box px={8} py={4}>
      <Heading size="sm">Entries</Heading>
      <DataTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        isLoading={loading}
        pageCount={pageCount}
        totalCount={totalCount}
        rowProps={(row: Row<DashboardEntry>) => ({
          onClick: onRowClick(row),
          cursor: 'pointer',
          height: '2.5rem',
          _hover: {
            background: rowHoverColor,
          },
        })}
        p={4}
      />
    </Box>
  );
}

export default Dashboard;
