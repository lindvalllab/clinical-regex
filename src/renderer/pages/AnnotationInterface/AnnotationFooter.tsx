import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

type AnnotationFooterProps = {
  page: number;
  totalPages: number;
  groupId: string;
  groupIdField?: string | null;
  onPrevPage: () => void;
  onNextPage: () => void;
};

function AnnotationFooter({
  page,
  totalPages,
  groupId,
  groupIdField,
  onPrevPage,
  onNextPage,
}: AnnotationFooterProps): JSX.Element {
  const bg = useColorModeValue('white', 'gray.800');
  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  return (
    <Flex
      w="full"
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
          {groupId !== null ? (
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Group ID [
              {groupIdField
                ? `${groupIdField}`
                : 'No Group ID Field identified'}
              ]
            </Text>
          ) : (
            <></>
          )}
          <Text fontSize="md" fontWeight="extrabold">
            {page + 1} / {totalPages}
          </Text>
          <Text fontSize="md" fontWeight="extrabold">
            {groupId}
          </Text>
        </Grid>
      </Flex>
      <ButtonGroup isAttached>
        <Button colorScheme="gray" onClick={onPrevPage} disabled={isFirstPage}>
          Prev
        </Button>
        <Button colorScheme="gray" onClick={onNextPage} disabled={isLastPage}>
          Next
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export default AnnotationFooter;
