import { useEffect } from 'react';
import {
  useTable,
  usePagination,
  TableOptions,
  useAsyncDebounce,
} from 'react-table';
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/** Reference comment/thread (I'm not sure I understand all the types)
 * https://github.com/tannerlinsley/react-table/discussions/2664#discussioncomment-250551
 */
type DataTableProps<T extends Record<string, unknown>> = TableOptions<T> &
  BoxProps;

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  totalCount,
  rowProps,
  ...props
}: DataTableProps<T>): JSX.Element {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable<T>(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    usePagination
  );

  // For a slightly better experience
  // https://react-table.tanstack.com/docs/faq#how-can-i-debounce-rapid-table-state-changes
  const onFetchDataDebounced = useAsyncDebounce(fetchData, 100);

  useEffect(() => {
    onFetchDataDebounced({ pageIndex, pageSize });
  }, [onFetchDataDebounced, pageIndex, pageSize]);

  const displayPage = pageIndex + 1;

  return (
    <Box {...props}>
      <Flex justifyContent="space-between" alignItems="flex-end" mb={6}>
        <Flex gridGap={4} alignItems="flex-end">
          <ButtonGroup isAttached size="sm">
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              First
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              Last
            </Button>
          </ButtonGroup>
          <FormControl>
            <FormLabel fontSize="xs">Go to page</FormLabel>
            <NumberInput
              defaultValue={displayPage}
              min={1}
              max={pageOptions.length}
              onChange={(page) => {
                gotoPage(Number(page) - 1);
              }}
              value={displayPage}
              size="sm"
              allowMouseWheel
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs">Rows per page</FormLabel>
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              size="sm"
            >
              {PAGE_SIZE_OPTIONS.map((pageSize) => (
                <option key={pageSize}>{pageSize}</option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        <Flex flexDirection="column" textAlign="right">
          <Text fontSize="xs" fontWeight="bold">
            Page {displayPage} of {pageOptions.length}
          </Text>
          <Text fontSize="xs">
            {loading
              ? 'Loading...'
              : `Showing ${pageSize * pageIndex + 1} -
              ${pageSize * pageIndex + page.length} of ${totalCount} results`}
          </Text>
        </Flex>
      </Flex>
      <Table {...getTableProps()} size="sm">
        <Thead>
          {headerGroups.map((group) => (
            <Tr {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            const data = {
              pageSize: pageSize,
              pageIndex: pageIndex,
            };
            return (
              <Tr {...row.getRowProps(rowProps(row, data))}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

export default DataTable;
