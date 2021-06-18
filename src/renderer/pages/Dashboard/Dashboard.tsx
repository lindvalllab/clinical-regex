import { useContext, useState, useMemo, useRef, useCallback } from 'react';
import { Column, Row } from 'react-table';
import { ApiContext } from '../../api';
import { Box, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { TextEntity } from '../../../types';
import DataTable from '../../components/DataTable';

function Dashboard(): JSX.Element {
  const api = useContext(ApiContext);
  const columns = useMemo<Column<TextEntity>[]>(
    () => [
      {
        Header: 'Entry ID',
        accessor: 'id',
      },
      {
        Header: 'Group ID',
        accessor: 'group_id',
      },
      {
        Header: 'Keyword Matches',
        Cell: () => <Tag>Label</Tag>,
      },
      {
        Header: 'Is Annotated',
        Cell: () => <Icon as={FaCheckCircle} color="green.500" />,
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
    []
  );
  const [data, setData] = useState<TextEntity[]>([]);
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

  return (
    <Box px={8} py={4}>
      <Heading size="sm">Entries</Heading>
      <DataTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        totalCount={totalCount}
        rowProps={(row: Row) => ({
          onClick: () => console.log(row),
        })}
        p={4}
      />
    </Box>
  );
}

export default Dashboard;
