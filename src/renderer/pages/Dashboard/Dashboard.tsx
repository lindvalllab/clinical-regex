import { useEffect, useContext, useState } from 'react';
import { ApiContext } from '../../api';
import {
  Box,
  Heading,
  Icon,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

function Dashboard(): JSX.Element {
  const api = useContext(ApiContext);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  // Get the list of groupIds on initial render.
  useEffect(() => {
    api
      .getAllGroupIds()
      .then((ids) => {
        setGroupIds(ids);
      })
      .catch((e) => console.error(e));
  }, [api]);

  return (
    <Box px={8} py={4}>
      <Heading size="sm">Entries</Heading>
      <Box>
        <Table variant="simple" size="sm">
          <Thead>
            <Th>Group ID</Th>
            <Th>Text</Th>
            <Th>Keyword Matches</Th>
            <Th>Is Annotated</Th>
          </Thead>
          <Tbody>
            {groupIds.map((id) => (
              <Tr>
                <Td>{id}</Td>
                <Td>Text</Td>
                <Td>
                  <Tag>Label</Tag>
                </Td>
                <Td>
                  <Icon as={FaCheckCircle} color="green.500" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default Dashboard;
